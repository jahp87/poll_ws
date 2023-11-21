import {Entity, hasOne, model, property} from '@loopback/repository';
import {UserCredentials} from './user-credentials.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    nullable: false,
  })
  role: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
}


@model()
export class ChangePasswordUser {
  @property({
    type: 'string',

  })
  userId: string;

  @property({
    type: 'string',

  })
  oldPassword: string;

  @property({
    type: 'string',

  })
  newPassword: string;

  @property({
    type: 'string',

  })
  confirmNewPassword: string;
}


export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
