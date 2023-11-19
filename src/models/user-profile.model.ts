import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {Poll} from './poll.model';
import {ProfilePoll} from './profile-poll.model';

@model()
export class UserProfile extends Entity {
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
  fullname: string;

  @property({
    type: 'string',
    required: true,
  })
  avatar: string;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Poll, {through: {model: () => ProfilePoll}})
  polls: Poll[];

  constructor(data?: Partial<UserProfile>) {
    super(data);
  }
}

export interface UserProfileRelations {
  // describe navigational properties here
}

export type UserProfileWithRelations = UserProfile & UserProfileRelations;
