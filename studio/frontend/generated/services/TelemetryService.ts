/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
     * @returns ThreatLog Successful Response
     * @throws ApiError
     */
    public static getThreatsApiV1ThreatsGet(
        projectId?: string,
        limit: number = 100,
        skip?: number,
    ): CancelablePromise<Array<ThreatLog>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/threats',
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
