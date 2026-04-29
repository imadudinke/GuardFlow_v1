/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for incoming telemetry data from SDK
 */
export type TelemetrySchema = {
    ip: string;
    dna: string;
    path: string;
    status: string;
    factors?: Array<string>;
    metadata?: Record<string, any>;
    headers?: (Record<string, any> | null);
    agent?: (string | null);
    trace_id?: (string | null);
    country?: (string | null);
    reason?: (string | null);
};

