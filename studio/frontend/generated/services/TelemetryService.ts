/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BlacklistCheckResponse } from '../models/BlacklistCheckResponse';
import type { BlacklistCheckSchema } from '../models/BlacklistCheckSchema';
import type { RuntimeConfigResponse } from '../models/RuntimeConfigResponse';
import type { TelemetrySchema } from '../models/TelemetrySchema';
import type { ThreatLog } from '../models/ThreatLog';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TelemetryService {
    /**
     * Receive Telemetry
     * Receive telemetry data from GuardFlow SDK
     *
     * Validates API key and stores threat logs in database
     * @param requestBody
     * @param xGuardFlowKey
     * @returns any Successful Response
     * @throws ApiError
     */
    public static receiveTelemetryApiV1TelemetryPost(
        requestBody: TelemetrySchema,
        xGuardFlowKey?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/telemetry',
            headers: {
                'X-GuardFlow-Key': xGuardFlowKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Check Blacklist
     * Check whether a DNA fingerprint is globally blacklisted.
     * @param requestBody
     * @param xGuardFlowKey
     * @returns BlacklistCheckResponse Successful Response
     * @throws ApiError
     */
    public static checkBlacklistApiV1TelemetryBlacklistCheckPost(
        requestBody: BlacklistCheckSchema,
        xGuardFlowKey?: string,
    ): CancelablePromise<BlacklistCheckResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/telemetry/blacklist-check',
            headers: {
                'X-GuardFlow-Key': xGuardFlowKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Runtime Config
     * Return project-level control-plane configuration for the SDK.
     * @param xGuardFlowKey
     * @returns RuntimeConfigResponse Successful Response
     * @throws ApiError
     */
    public static getRuntimeConfigApiV1TelemetryRuntimeConfigGet(
        xGuardFlowKey?: string,
    ): CancelablePromise<RuntimeConfigResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/telemetry/runtime-config',
            headers: {
                'X-GuardFlow-Key': xGuardFlowKey,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Threats
     * Get threat logs for a specific project
     *
     * Required:
     * - project_id: The project to get threats for
     *
     * Optional:
     * - limit: Maximum number of results (default 100)
     * - skip: Number of results to skip for pagination (default 0)
     *
     * Returns threats ordered by most recent first
     * @param projectId
     * @param limit
     * @param skip
     * @param accessToken
     * @returns ThreatLog Successful Response
     * @throws ApiError
     */
    public static getThreatsApiV1ThreatsGet(
        projectId?: string,
        limit: number = 100,
        skip?: number,
        accessToken?: (string | null),
    ): CancelablePromise<Array<ThreatLog>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/threats',
            cookies: {
                'access_token': accessToken,
            },
            query: {
                'project_id': projectId,
                'limit': limit,
                'skip': skip,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
