import { type PropertyModel } from '../../domain/models';
import { type AddPropertyDTO } from '../dtos';
import { mockAddPropertyApiResponse } from './mock-http';

const { box, address, client, id } = mockAddPropertyApiResponse;

export const mockAddPropertyDTO: AddPropertyDTO = {
  address,
  box,
  client,
  auto_connect: false,
  force: true
};

export const mockPropertyModel: PropertyModel = {
  id,
  address,
  box,
  client
};
