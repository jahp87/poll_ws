import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  HttpErrors,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {Poll, PollResults} from '../models';
import {PollAnswerRepository, PollQuestionRepository, PollRepository, PollVoteRepository} from '../repositories';

export class PollController {
  constructor(
    @repository(PollRepository)
    public pollRepository: PollRepository,
    @repository(PollAnswerRepository)
    public pollAnswerRepository: PollAnswerRepository,
    @repository(PollVoteRepository)
    public pollVoteRepository: PollVoteRepository,
    @repository(PollQuestionRepository)
    public pollQuestionRepository: PollQuestionRepository,
  ) { }

  @post('/polls')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  @response(200, {
    description: 'Poll model instance',
    content: {'application/json': {schema: getModelSchemaRef(Poll)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Poll, {
            title: 'NewPoll',
            exclude: ['id'],
          }),
        },
      },
    })
    poll: Omit<Poll, 'id'>,
  ): Promise<Poll> {
    return this.pollRepository.create(poll);
  }


  @get('/polls')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  @response(200, {
    description: 'Array of Poll model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Poll, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Poll) filter?: Filter<Poll>,
  ): Promise<Poll[]> {
    return this.pollRepository.find(filter);
  }

  @get('/polls/results/{id}')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'user'],
    voters: [basicAuthorization],
  })
  @response(200, {
    description: 'Poll model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Poll, {includeRelations: true}),
      },
    },
  })
  async results(
    @param.path.string('id') id: string,
  ): Promise<PollResults[]> {
    const poll = this.pollRepository.findById(id);
    if (!poll) {throw new HttpErrors.BadRequest('poll not found');}

    const answers = await this.pollAnswerRepository.find({
      where: {
        pollId: id
      }
    });

    const questions = await this.pollQuestionRepository.find({
      where: {
        pollId: id
      }
    });

    let resultResponse: PollResults[] = [];

    for (let answer of answers) {
      for (let question of questions) {
        let votes = await this.pollVoteRepository.find({
          where: {
            and: [
              {
                pollId: id
              },
              {
                pollQuestionId: question.id
              },
              {
                pollAnswerId: answer.id
              }
            ]
          }
        });

        resultResponse.push({
          questions: question.content,
          answer: question.content,
          votes: votes.length
        })
      }
    }

    return resultResponse;

  }


  @get('/polls/{id}')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  @response(200, {
    description: 'Poll model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Poll, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Poll, {exclude: 'where'}) filter?: FilterExcludingWhere<Poll>
  ): Promise<Poll> {
    return this.pollRepository.findById(id, filter);
  }

  @patch('/polls/{id}')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  @response(204, {
    description: 'Poll PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Poll, {partial: true}),
        },
      },
    })
    poll: Poll,
  ): Promise<void> {
    await this.pollRepository.updateById(id, poll);
  }

  @put('/polls/{id}')
  @response(204, {
    description: 'Poll PUT success',
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() poll: Poll,
  ): Promise<void> {
    await this.pollRepository.replaceById(id, poll);
  }

  @del('/polls/{id}')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  @response(204, {
    description: 'Poll DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pollRepository.deleteById(id);
  }
}
