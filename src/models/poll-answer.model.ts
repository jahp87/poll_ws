import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Poll} from './poll.model';
import {PollQuestion} from './poll-question.model';

@model()
export class PollAnswer extends Entity {
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

  @belongsTo(() => Poll)
  pollId: string;

  @belongsTo(() => PollQuestion)
  pollQuestionId: string;

  constructor(data?: Partial<PollAnswer>) {
    super(data);
  }
}

export interface PollAnswerRelations {
  // describe navigational properties here
}

export type PollAnswerWithRelations = PollAnswer & PollAnswerRelations;
