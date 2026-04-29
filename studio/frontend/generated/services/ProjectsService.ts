/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Project } from '../models/Project';
import type { ProjectCreate } from '../models/ProjectCreate';
import type { ProjectUpdate } from '../models/ProjectUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectsService {
    /**
     * Create Project
     * Create a new project
     * @param requestBody
     * @param accessToken
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static createProjectApiV1ProjectsPost(
        requestBody: ProjectCreate,
        accessToken?: (string | null),
    ): CancelablePromise<Project> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects/',
            cookies: {
                'access_token': accessToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Projects
     * Get all projects for the authenticated user
     * @param skip
     * @param limit
     * @param accessToken
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static readProjectsApiV1ProjectsGet(
        skip?: number,
        limit: number = 100,
        accessToken?: (string | null),
    ): CancelablePromise<Array<Project>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/',
            cookies: {
                'access_token': accessToken,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read User Projects
     * Get all projects for the authenticated user
     * @param userId
     * @param skip
     * @param limit
     * @param accessToken
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static readUserProjectsApiV1ProjectsUserUserIdGet(
        userId: string,
        skip?: number,
        limit: number = 100,
        accessToken?: (string | null),
    ): CancelablePromise<Array<Project>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/user/{user_id}',
            path: {
                'user_id': userId,
            },
            cookies: {
                'access_token': accessToken,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Project
     * Get a specific project by ID
     * @param projectId
     * @param accessToken
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static readProjectApiV1ProjectsProjectIdGet(
        projectId: string,
        accessToken?: (string | null),
    ): CancelablePromise<Project> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/{project_id}',
            path: {
                'project_id': projectId,
            },
            cookies: {
                'access_token': accessToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Project
     * Update a project
     * @param projectId
     * @param requestBody
     * @param accessToken
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static updateProjectApiV1ProjectsProjectIdPatch(
        projectId: string,
        requestBody: ProjectUpdate,
        accessToken?: (string | null),
    ): CancelablePromise<Project> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/projects/{project_id}',
            path: {
                'project_id': projectId,
            },
            cookies: {
                'access_token': accessToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Project
     * Delete a project
     * @param projectId
     * @param accessToken
     * @returns void
     * @throws ApiError
     */
    public static deleteProjectApiV1ProjectsProjectIdDelete(
        projectId: string,
        accessToken?: (string | null),
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/projects/{project_id}',
            path: {
                'project_id': projectId,
            },
            cookies: {
                'access_token': accessToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Rotate Project Key
     * Rotate a project's live API key
     * @param projectId
     * @param accessToken
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static rotateProjectKeyApiV1ProjectsProjectIdRotateKeyPost(
        projectId: string,
        accessToken?: (string | null),
    ): CancelablePromise<Project> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects/{project_id}/rotate-key',
            path: {
                'project_id': projectId,
            },
            cookies: {
                'access_token': accessToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
