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
  PollAnswer,
} from '../models';
import {PollVoteRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../middlewares/auth.midd';

export class PollVotePollAnswerController {
  constructor(
    @repository(PollVoteRepository)
    public pollVoteRepository: PollVoteRepository,
  ) { }

  @get('/poll-votes/{id}/poll-answer', {
    responses: {
      '200': {
        description: 'PollAnswer belonging to PollVote',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PollAnswer),
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
  async getPollAnswer(
    @param.path.string('id') id: typeof PollVote.prototype.id,
  ): Promise<PollAnswer> {
    return this.pollVoteRepository.pollAnswer(id);
  }
}
