import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {PollVote} from '../models';
import {PollRepository, PollVoteRepository} from '../repositories';

export class PollVoteController {
  constructor(
    @repository(PollVoteRepository)
    public pollVoteRepository: PollVoteRepository,
    public pollRepository: PollRepository
  ) { }

  @post('/poll-votes')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'user'],
    voters: [basicAuthorization],
  })
  @response(200, {
    description: 'PollVote model instance',
    content: {'application/json': {schema: getModelSchemaRef(PollVote)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PollVote, {
            title: 'NewPollVote',
            exclude: ['id'],
          }),
        },
      },
    })
    pollVote: Omit<PollVote, 'id'>,
  ): Promise<PollVote> {
    const findPollVote = await this.pollVoteRepository.findOne({
      where: {
        and: [
          {
            pollAnswerId: pollVote.pollAnswerId
          },
          {
            userProfileId: pollVote.userProfileId
          },
          {
            pollQuestionId: pollVote.pollQuestionId
          },
          {
            pollId: pollVote.pollId
          }
        ]
      }
    });

    if (findPollVote == null) {
      throw new HttpErrors.BadRequest('Don\' t can vote in this poll ');

    }

    const findPoll = await this.pollRepository.findById(pollVote.pollId);

    if (new Date(findPoll.closed) > new Date()) {

      throw new HttpErrors.BadRequest('This poll is closed');
    }



    return this.pollVoteRepository.create(pollVote);
  }


  @get('/poll-votes')
  @response(200, {
    description: 'Array of PollVote model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PollVote, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PollVote) filter?: Filter<PollVote>,
  ): Promise<PollVote[]> {
    return this.pollVoteRepository.find(filter);
  }

  @patch('/poll-votes')
  @response(200, {
    description: 'PollVote PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PollVote, {partial: true}),
        },
      },
    })
    pollVote: PollVote,
    @param.where(PollVote) where?: Where<PollVote>,
  ): Promise<Count> {
    return this.pollVoteRepository.updateAll(pollVote, where);
  }

  @get('/poll-votes/{id}')
  @response(200, {
    description: 'PollVote model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PollVote, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PollVote, {exclude: 'where'}) filter?: FilterExcludingWhere<PollVote>
  ): Promise<PollVote> {
    return this.pollVoteRepository.findById(id, filter);
  }

  @patch('/poll-votes/{id}')
  @response(204, {
    description: 'PollVote PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PollVote, {partial: true}),
        },
      },
    })
    pollVote: PollVote,
  ): Promise<void> {
    await this.pollVoteRepository.updateById(id, pollVote);
  }

  @put('/poll-votes/{id}')
  @response(204, {
    description: 'PollVote PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() pollVote: PollVote,
  ): Promise<void> {
    await this.pollVoteRepository.replaceById(id, pollVote);
  }

  @del('/poll-votes/{id}')
  @response(204, {
    description: 'PollVote DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pollVoteRepository.deleteById(id);
  }
}
