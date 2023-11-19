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
  UserProfile,
} from '../models';
import {PollVoteRepository} from '../repositories';

export class PollVoteUserProfileController {
  constructor(
    @repository(PollVoteRepository)
    public pollVoteRepository: PollVoteRepository,
  ) { }

  @get('/poll-votes/{id}/user-profile', {
    responses: {
      '200': {
        description: 'UserProfile belonging to PollVote',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserProfile),
          },
        },
      },
    },
  })
  async getUserProfile(
    @param.path.string('id') id: typeof PollVote.prototype.id,
  ): Promise<UserProfile> {
    return this.pollVoteRepository.userProfile(id);
  }
}
