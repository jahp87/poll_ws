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
  PollVote,
} from '../models';
import {PollRepository} from '../repositories';

export class PollPollVoteController {
  constructor(
    @repository(PollRepository) protected pollRepository: PollRepository,
  ) { }

  @get('/polls/{id}/poll-votes', {
    responses: {
      '200': {
        description: 'Array of Poll has many PollVote',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PollVote)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<PollVote>,
  ): Promise<PollVote[]> {
    return this.pollRepository.pollVotes(id).find(filter);
  }

  @post('/polls/{id}/poll-votes', {
    responses: {
      '200': {
        description: 'Poll model instance',
        content: {'application/json': {schema: getModelSchemaRef(PollVote)}},
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
          schema: getModelSchemaRef(PollVote, {
            title: 'NewPollVoteInPoll',
            exclude: ['id'],
            optional: ['pollId']
          }),
        },
      },
    }) pollVote: Omit<PollVote, 'id'>,
  ): Promise<PollVote> {
    return this.pollRepository.pollVotes(id).create(pollVote);
  }

  @patch('/polls/{id}/poll-votes', {
    responses: {
      '200': {
        description: 'Poll.PollVote PATCH success count',
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
          schema: getModelSchemaRef(PollVote, {partial: true}),
        },
      },
    })
    pollVote: Partial<PollVote>,
    @param.query.object('where', getWhereSchemaFor(PollVote)) where?: Where<PollVote>,
  ): Promise<Count> {
    return this.pollRepository.pollVotes(id).patch(pollVote, where);
  }

  @del('/polls/{id}/poll-votes', {
    responses: {
      '200': {
        description: 'Poll.PollVote DELETE success count',
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
    @param.query.object('where', getWhereSchemaFor(PollVote)) where?: Where<PollVote>,
  ): Promise<Count> {
    return this.pollRepository.pollVotes(id).delete(where);
  }
}
