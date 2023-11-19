import {Entity, model, property, belongsTo} from '@loopback/repository';
import {PollVote} from './poll-vote.model';

@model()
export class PollQuestion extends Entity {
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
  content: string;

  @property({
    type: 'string',
  })
  pollId?: string;

  @belongsTo(() => PollVote)
  pollVoteId: string;

  constructor(data?: Partial<PollQuestion>) {
    super(data);
  }
}

export interface PollQuestionRelations {
  // describe navigational properties here
}

export type PollQuestionWithRelations = PollQuestion & PollQuestionRelations;
