import { ApiStatus } from '../types/apiModels';

export const getApiStatus = (error: any) => {
  switch (true) {
    case error.toString().includes('400'):
      return ApiStatus.BadRequest;
    case error.toString().includes('401'):
      return ApiStatus.Unauthorized;
    case error.toString().includes('403'):
      return ApiStatus.Forbidden;
    case error.toString().includes('404'):
      return ApiStatus.NotFound;
    case error.toString().includes('500'):
      return ApiStatus.ServerError;
    case error.toString().includes('Error'):
      return ApiStatus.BadRequest;
    default:
      return ApiStatus.Unknown;
  }
};

export const isExpiredTokenStatus = (apiStatus: ApiStatus) => apiStatus === ApiStatus.Unauthorized;
