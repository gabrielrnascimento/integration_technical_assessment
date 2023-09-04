import { type UserModel } from '../../domain/models';

export type AddClientDTO = Pick<UserModel, 'name' | 'code' | 'observation'>;
