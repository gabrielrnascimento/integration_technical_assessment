import axios from 'axios';
import { type HttpClient } from '../../data/interfaces';
import { type HttpRequest, type HttpResponse } from '../../data/types';

export class AxiosHttpClient implements HttpClient {
  async request (request: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: any;
    try {
      axiosResponse = await axios.request(request);
    } catch (error) {
      const { status, statusText } = error.response;
      axiosResponse = { status, data: { message: statusText, stack: error.stack } };
    }
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    };
  }
}
