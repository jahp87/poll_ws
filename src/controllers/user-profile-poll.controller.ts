import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {
  Poll
} from '../models';
import {UserProfileRepository} from '../repositories';

export class UserProfilePollController {
  constructor(
    @repository(UserProfileRepository) protected userProfileRepository: UserProfileRepository,
  ) { }

  @get('/user-profiles/{id}/polls', {
    responses: {
      '200': {
        description: 'Array of UserProfile has many Poll through ProfilePoll',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Poll)},
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
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Poll>,
  ): Promise<Poll[]> {
    return this.userProfileRepository.polls(id).find(filter);
  }


}
