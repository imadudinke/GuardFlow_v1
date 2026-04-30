import { OpenAPI } from '@/generated/core/OpenAPI';
import { getApiOrigin } from '@/lib/api/url';

/**
 * Configure the OpenAPI client with the backend base URL
 * Call this once at app initialization
 */
export function configureAPI() {
  OpenAPI.BASE = getApiOrigin();
  
  // Configure credentials if needed
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = 'include';
}

configureAPI();
