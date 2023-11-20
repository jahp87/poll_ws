import {Entity, hasMany, model, property} from '@loopback/repository';
import {PollQuestion} from './poll-question.model';

@model()
export class Poll extends Entity {
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
  title: string;

  @property({
    type: 'string',
  })
  slug?: string;

  @property({
    type: 'date',
    required: true,
  })
  created: string;

  @property({
    type: 'date',
    required: true,
  })
  published: string;

  @property({
    type: 'date',
    required: true,
  })
  closed: string;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @hasMany(() => PollQuestion)
  pollQuestions: PollQuestion[];

  constructor(data?: Partial<Poll>) {
    super(data);
  }
}

export interface PollRelations {
  // describe navigational properties here
}

export type PollWithRelations = Poll & PollRelations;
