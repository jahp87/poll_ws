import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {
  Poll,
  PollAnswer,
} from '../models';
import {PollAnswerRepository} from '../repositories';

export class PollAnswerPollController {
  constructor(
    @repository(PollAnswerRepository)
    public pollAnswerRepository: PollAnswerRepository,
  ) { }

  @get('/poll-answers/{id}/poll', {
    responses: {
      '200': {
        description: 'Poll belonging to PollAnswer',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Poll),
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
  async getPoll(
    @param.path.string('id') id: typeof PollAnswer.prototype.id,
  ): Promise<Poll> {
    return this.pollAnswerRepository.poll(id);
  }
}
