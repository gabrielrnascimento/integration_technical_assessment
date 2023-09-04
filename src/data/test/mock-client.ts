import { type ClientModel } from '../../domain/models';
import { type AddClientDTO } from '../dtos';
import { mockAddClientApiResponse } from './mock-http';
import { mockUserModel } from './mock-user';

const { code, name, observation } = mockUserModel;

export const mockAddClientDTO: AddClientDTO = { code, name, observation };

export const mockClientModel: ClientModel = { id: mockAddClientApiResponse.id };
