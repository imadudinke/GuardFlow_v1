import type { ThreatLog } from "@/generated/models/ThreatLog"

export const GLOBAL_BLACKLIST_FACTOR = "global_blacklist_match"

export function hasRiskFactor(threat: ThreatLog, factor: string): boolean {
  return Boolean(threat.risk_factors?.includes(factor))
}

export function isKnownAttackerThreat(threat: ThreatLog): boolean {
  return hasRiskFactor(threat, GLOBAL_BLACKLIST_FACTOR)
}

export function countUniqueKnownAttackers(threats: ThreatLog[]): number {
  return new Set(
    threats
      .filter((threat) => isKnownAttackerThreat(threat))
      .map((threat) => threat.dna_id)
  ).size
}
