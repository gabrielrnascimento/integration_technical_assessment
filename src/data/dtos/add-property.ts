import { type PropertyModel } from '../../domain/models';

export type AddPropertyDTO = Pick<PropertyModel, 'address' | 'box' | 'client' > & {
  auto_connect: boolean
  force: boolean
  previous?: boolean
};
