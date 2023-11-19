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
  User,
  UserProfile,
} from '../models';
import {UserProfileRepository} from '../repositories';

export class UserProfileUserController {
  constructor(
    @repository(UserProfileRepository)
    public userProfileRepository: UserProfileRepository,
  ) { }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  @get('/user-profiles/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserProfile',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof UserProfile.prototype.id,
  ): Promise<User> {
    return this.userProfileRepository.user(id);
  }
}


