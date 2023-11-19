import {Entity, model, property} from '@loopback/repository';

@model()
export class ProfilePoll extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  userProfileId?: string;

  @property({
    type: 'string',
  })
  pollId?: string;

  constructor(data?: Partial<ProfilePoll>) {
    super(data);
  }
}

export interface ProfilePollRelations {
  // describe navigational properties here
}

export type ProfilePollWithRelations = ProfilePoll & ProfilePollRelations;
