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
  async getPollAnswer(
    @param.path.string('id') id: typeof PollVote.prototype.id,
  ): Promise<PollAnswer> {
    return this.pollVoteRepository.pollAnswer(id);
  }
}
