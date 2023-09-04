import { type AddClientDTO } from '../../data/dtos';
import { type ClientModel } from '../models';

export interface AddClient {
  add: (data: AddClientDTO) => Promise<ClientModel>
}
