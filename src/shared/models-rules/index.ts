import { AppRequest } from '../models';
import getUuid from 'uuid-by-string';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return getUuid(request.user && request.user.id);
}
