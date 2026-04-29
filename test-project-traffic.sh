#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:8001/api/v1/telemetry}"
PROJECT_KEY="${PROJECT_KEY:-${1:-}}"
REQUEST_COUNT="${REQUEST_COUNT:-20}"
DELAY_SECONDS="${DELAY_SECONDS:-0.15}"
STATUS_MODE="${STATUS_MODE:-mixed}"

if [[ -z "${PROJECT_KEY}" ]]; then
  echo "Usage:"
  echo "  PROJECT_KEY=gf_live_xxx ./test-project-traffic.sh"
  echo "  ./test-project-traffic.sh gf_live_xxx"
  echo
  echo "Optional env vars:"
  echo "  API_URL=http://localhost:8001/api/v1/telemetry"
  echo "  REQUEST_COUNT=20"
  echo "  DELAY_SECONDS=0.15"
  echo "  STATUS_MODE=mixed   # mixed | banned | limit | ok"
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required but not installed."
  exit 1
fi

random_octet() {
  echo $((RANDOM % 223 + 1))
}

random_ip() {
  echo "$(random_octet).$((RANDOM % 255)).$((RANDOM % 255)).$((RANDOM % 255))"
}

pick_status() {
  case "${STATUS_MODE}" in
    banned) echo "BANNED" ;;
    limit) echo "LIMIT" ;;
    ok) echo "OK" ;;
    mixed)
      case $((RANDOM % 3)) in
        0) echo "BANNED" ;;
        1) echo "LIMIT" ;;
        *) echo "OK" ;;
      esac
      ;;
    *)
      echo "Invalid STATUS_MODE: ${STATUS_MODE}"
      exit 1
      ;;
  esac
}

PATHS=(
  "/login"
  "/wp-login.php"
  "/admin"
  "/api/auth"
  "/graphql"
  "/.env"
  "/phpmyadmin"
  "/checkout"
)

AGENTS=(
  "sqlmap/1.8"
  "python-requests/2.32"
  "curl/8.5.0"
  "Mozilla/5.0 (compatible; BotTest/1.0)"
)

success_count=0
failure_count=0

echo "Testing GuardFlow telemetry"
echo "API URL: ${API_URL}"
echo "Request count: ${REQUEST_COUNT}"
echo "Status mode: ${STATUS_MODE}"
echo

for ((i = 1; i <= REQUEST_COUNT; i++)); do
  status="$(pick_status)"
  ip="$(random_ip)"
  path="${PATHS[$((RANDOM % ${#PATHS[@]}))]}"
  agent="${AGENTS[$((RANDOM % ${#AGENTS[@]}))]}"
  dna="bot-$(date +%s)-${i}-$RANDOM"
  trace_id="trace-$RANDOM-$i"

  payload="$(printf '{"ip":"%s","dna":"%s","path":"%s","status":"%s","agent":"%s","trace_id":"%s"}' \
    "${ip}" "${dna}" "${path}" "${status}" "${agent}" "${trace_id}")"

  response_code="$(
    curl -sS -o /tmp/guardflow_test_response.json \
      -w "%{http_code}" \
      -X POST "${API_URL}" \
      -H "Content-Type: application/json" \
      -H "X-GuardFlow-Key: ${PROJECT_KEY}" \
      --data "${payload}"
  )"

  if [[ "${response_code}" == "201" ]]; then
    success_count=$((success_count + 1))
    echo "[${i}/${REQUEST_COUNT}] ${status} ${ip} ${path} -> saved"
  else
    failure_count=$((failure_count + 1))
    echo "[${i}/${REQUEST_COUNT}] ${status} ${ip} ${path} -> failed (${response_code})"
    if [[ -s /tmp/guardflow_test_response.json ]]; then
      echo "Response: $(tr '\n' ' ' </tmp/guardflow_test_response.json)"
    fi
  fi

  sleep "${DELAY_SECONDS}"
done

echo
echo "Finished."
echo "Saved: ${success_count}"
echo "Failed: ${failure_count}"
echo
echo "Open your dashboard or threats page to confirm the new events."
