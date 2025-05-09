import axios from 'axios';
import { ApiResponseCodes } from '../types/apiModels';

export const getApiStatus = (error: unknown): ApiResponseCodes => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    switch (status) {
      case 400: return ApiResponseCodes.BadRequest;
      case 401: return ApiResponseCodes.Unauthorized;
      case 403: return ApiResponseCodes.Forbidden;
      case 404: return ApiResponseCodes.NotFound;
      case 409: return ApiResponseCodes.Conflict;
      case 500: return ApiResponseCodes.ServerError;
      default: return ApiResponseCodes.Unknown;
    }
  }
  return ApiResponseCodes.Unknown;
};

export const isExpiredTokenStatus = (apiStatus: ApiResponseCodes) => apiStatus === ApiResponseCodes.Unauthorized;
