import '@/lib/api/config';
import { OpenAPI } from '@/generated/core/OpenAPI';
import { request } from '@/generated/core/request';
import type { ThreatLog } from '@/generated/models/ThreatLog';
import type { CancelablePromise } from '@/generated/core/CancelablePromise';

export interface PaginatedThreatsResponse {
  threats: ThreatLog[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export class ThreatsAPI {
  /**
   * Get threats for a specific project with pagination
   * @param projectId - The project UUID
   * @param limit - Maximum number of results per page (default: 20, max: 100)
   * @param skip - Number of results to skip for pagination (default: 0)
   * @returns Paginated threat logs response
   */
  static getThreatsForProject(
    projectId: string,
    limit: number = 20,
    skip: number = 0
  ): CancelablePromise<PaginatedThreatsResponse | Array<ThreatLog>> {
    return request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/threats',
      query: {
        project_id: projectId,
        limit,
        skip,
      },
      errors: {
        400: 'Bad Request - project_id is required',
        404: 'Project not found',
        422: 'Validation Error',
      },
    });
  }
}
