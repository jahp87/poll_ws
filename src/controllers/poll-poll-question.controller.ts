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
  PollQuestion,
} from '../models';
import {PollRepository} from '../repositories';

export class PollPollQuestionController {
  constructor(
    @repository(PollRepository) protected pollRepository: PollRepository,
  ) { }

  @get('/polls/{id}/poll-questions', {
    responses: {
      '200': {
        description: 'Array of Poll has many PollQuestion',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PollQuestion)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'user'],
    voters: [basicAuthorization],
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<PollQuestion>,
  ): Promise<PollQuestion[]> {
    return this.pollRepository.pollQuestions(id).find(filter);
  }

  @post('/polls/{id}/poll-questions', {
    responses: {
      '200': {
        description: 'Poll model instance',
        content: {'application/json': {schema: getModelSchemaRef(PollQuestion)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Poll.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PollQuestion, {
            title: 'NewPollQuestionInPoll',
            exclude: ['id'],
            optional: ['pollId']
          }),
        },
      },
    }) pollQuestion: Omit<PollQuestion, 'id'>,
  ): Promise<PollQuestion> {
    return this.pollRepository.pollQuestions(id).create(pollQuestion);
  }

  @patch('/polls/{id}/poll-questions', {
    responses: {
      '200': {
        description: 'Poll.PollQuestion PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PollQuestion, {partial: true}),
        },
      },
    })
    pollQuestion: Partial<PollQuestion>,
    @param.query.object('where', getWhereSchemaFor(PollQuestion)) where?: Where<PollQuestion>,
  ): Promise<Count> {
    return this.pollRepository.pollQuestions(id).patch(pollQuestion, where);
  }

  @del('/polls/{id}/poll-questions', {
    responses: {
      '200': {
        description: 'Poll.PollQuestion DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(PollQuestion)) where?: Where<PollQuestion>,
  ): Promise<Count> {
    return this.pollRepository.pollQuestions(id).delete(where);
  }
}
