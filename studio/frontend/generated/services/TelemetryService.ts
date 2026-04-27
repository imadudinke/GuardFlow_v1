/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TelemetrySchema } from '../models/TelemetrySchema';
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
}
