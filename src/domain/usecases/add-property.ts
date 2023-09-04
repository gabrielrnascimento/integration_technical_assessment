import { type AddPropertyDTO } from '../../data/dtos';
import { type PropertyModel } from '../models';

export interface AddProperty {
  add: (data: AddPropertyDTO) => Promise<PropertyModel>
}
