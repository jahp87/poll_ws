import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  PollVote,
  PollQuestion,
} from '../models';
import {PollVoteRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../middlewares/auth.midd';

export class PollVotePollQuestionController {
  constructor(
    @repository(PollVoteRepository)
    public pollVoteRepository: PollVoteRepository,
  ) { }

  @get('/poll-votes/{id}/poll-question', {
    responses: {
      '200': {
        description: 'PollQuestion belonging to PollVote',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PollQuestion),
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
  async getPollQuestion(
    @param.path.string('id') id: typeof PollVote.prototype.id,
  ): Promise<PollQuestion> {
    return this.pollVoteRepository.pollQuestion(id);
  }
}
