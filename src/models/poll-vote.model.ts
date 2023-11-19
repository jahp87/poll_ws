import {Entity, model, property, belongsTo} from '@loopback/repository';
import {PollAnswer} from './poll-answer.model';
import {UserProfile} from './user-profile.model';
import {PollQuestion} from './poll-question.model';
import {Poll} from './poll.model';

@model()
export class PollVote extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => PollAnswer)
  pollAnswerId: string;

  @belongsTo(() => UserProfile)
  userProfileId: string;

  @belongsTo(() => PollQuestion)
  pollQuestionId: string;

  @belongsTo(() => Poll)
  pollId: string;

  constructor(data?: Partial<PollVote>) {
    super(data);
  }
}

export interface PollVoteRelations {
  // describe navigational properties here
}

export type PollVoteWithRelations = PollVote & PollVoteRelations;
