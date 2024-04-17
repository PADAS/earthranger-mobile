export interface FileRequest {
  uri: string,
  type: string,
  name: string,
}

export enum ApiStatus {
  Unknown = 1,
  Succeeded = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
}
