import { type HttpRequest, type HttpResponse } from '../types';

export interface HttpClient<R = any> {
  request: (request: HttpRequest) => Promise<HttpResponse<R>>
}
