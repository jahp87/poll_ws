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
  Poll,
} from '../models';
import {PollVoteRepository} from '../repositories';

export class PollVotePollController {
  constructor(
    @repository(PollVoteRepository)
    public pollVoteRepository: PollVoteRepository,
  ) { }

  @get('/poll-votes/{id}/poll', {
    responses: {
      '200': {
        description: 'Poll belonging to PollVote',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Poll),
          },
        },
      },
    },
  })
  async getPoll(
    @param.path.string('id') id: typeof PollVote.prototype.id,
  ): Promise<Poll> {
    return this.pollVoteRepository.poll(id);
  }
}
