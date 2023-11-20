import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {
  Poll,
  PollAnswer,
} from '../models';
import {PollRepository} from '../repositories';

export class PollPollAnswerController {
  constructor(
    @repository(PollRepository) protected pollRepository: PollRepository,
  ) { }

  @get('/polls/{id}/poll-answers', {
    responses: {
      '200': {
        description: 'Array of Poll has many PollAnswer',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PollAnswer)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<PollAnswer>,
  ): Promise<PollAnswer[]> {
    return this.pollRepository.pollAnswers(id).find(filter);
  }

  @post('/polls/{id}/poll-answers', {
    responses: {
      '200': {
        description: 'Poll model instance',
        content: {'application/json': {schema: getModelSchemaRef(PollAnswer)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  async create(
    @param.path.string('id') id: typeof Poll.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PollAnswer, {
            title: 'NewPollAnswerInPoll',
            exclude: ['id'],
            optional: ['pollId']
          }),
        },
      },
    }) pollAnswer: Omit<PollAnswer, 'id'>,
  ): Promise<PollAnswer> {
    return this.pollRepository.pollAnswers(id).create(pollAnswer);
  }

  @patch('/polls/{id}/poll-answers', {
    responses: {
      '200': {
        description: 'Poll.PollAnswer PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PollAnswer, {partial: true}),
        },
      },
    })
    pollAnswer: Partial<PollAnswer>,
    @param.query.object('where', getWhereSchemaFor(PollAnswer)) where?: Where<PollAnswer>,
  ): Promise<Count> {
    return this.pollRepository.pollAnswers(id).patch(pollAnswer, where);
  }

  @del('/polls/{id}/poll-answers', {
    responses: {
      '200': {
        description: 'Poll.PollAnswer DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(PollAnswer)) where?: Where<PollAnswer>,
  ): Promise<Count> {
    return this.pollRepository.pollAnswers(id).delete(where);
  }
}
