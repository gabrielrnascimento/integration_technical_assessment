import { type UserModel } from '../models';

export interface GetUser {
  get: () => Promise<UserModel>
}
