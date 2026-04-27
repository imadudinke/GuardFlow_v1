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
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static createProjectApiV1ProjectsPost(
        requestBody: ProjectCreate,
    ): CancelablePromise<Project> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Projects
     * Get all projects
     * @param skip
     * @param limit
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static readProjectsApiV1ProjectsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<Project>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/',
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
     * Get all projects for a specific user
     * @param userId
     * @param skip
     * @param limit
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static readUserProjectsApiV1ProjectsUserUserIdGet(
        userId: string,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<Project>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/user/{user_id}',
            path: {
                'user_id': userId,
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
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static readProjectApiV1ProjectsProjectIdGet(
        projectId: string,
    ): CancelablePromise<Project> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/{project_id}',
            path: {
                'project_id': projectId,
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
     * @returns Project Successful Response
     * @throws ApiError
     */
    public static updateProjectApiV1ProjectsProjectIdPatch(
        projectId: string,
        requestBody: ProjectUpdate,
    ): CancelablePromise<Project> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/projects/{project_id}',
            path: {
                'project_id': projectId,
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
     * @returns void
     * @throws ApiError
     */
    public static deleteProjectApiV1ProjectsProjectIdDelete(
        projectId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/projects/{project_id}',
            path: {
                'project_id': projectId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
