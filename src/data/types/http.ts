export type HttpMethod = 'post' | 'get';

export type HttpRequest = {
  method: HttpMethod
  url: string
  headers?: any
  body?: any
  data?: any
};

export enum HttpStatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  serverError = 500
}

export type HttpResponse<B = any> = {
  statusCode: HttpStatusCode
  body?: B
};
