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
  PollQuestion,
  PollVote,
} from '../models';
import {PollQuestionRepository} from '../repositories';

export class PollQuestionPollVoteController {
  constructor(
    @repository(PollQuestionRepository)
    public pollQuestionRepository: PollQuestionRepository,
  ) { }

  @get('/poll-questions/{id}/poll-vote', {
    responses: {
      '200': {
        description: 'PollVote belonging to PollQuestion',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PollVote),
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
  async getPollVote(
    @param.path.string('id') id: typeof PollQuestion.prototype.id,
  ): Promise<PollVote> {
    return this.pollQuestionRepository.pollVote(id);
  }
}
