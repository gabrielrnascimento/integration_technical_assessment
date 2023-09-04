import axios from 'axios';

export const mockAxiosHttpResponse = (): any => ({
  data: {
    field: 'any_value'
  },
  status: 200
});

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.request.mockClear().mockResolvedValue(mockAxiosHttpResponse());
  return mockedAxios;
};
