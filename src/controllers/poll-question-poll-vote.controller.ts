import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
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
  async getPollVote(
    @param.path.string('id') id: typeof PollQuestion.prototype.id,
  ): Promise<PollVote> {
    return this.pollQuestionRepository.pollVote(id);
  }
}
