import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {UserProfile} from '../models';
import {UserProfileRepository} from '../repositories';

export class UserprofileController {
  constructor(
    @repository(UserProfileRepository)
    public userProfileRepository: UserProfileRepository,
  ) { }

  @post('/user-profiles')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'user'],
    voters: [basicAuthorization],
  })
  @response(200, {
    description: 'UserProfile model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserProfile)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProfile, {
            title: 'NewUserProfile',
            exclude: ['id'],
          }),
        },
      },
    })
    userProfile: Omit<UserProfile, 'id'>,
  ): Promise<UserProfile> {
    return this.userProfileRepository.create(userProfile);
  }



  @get('/user-profiles')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  @response(200, {
    description: 'Array of UserProfile model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserProfile, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserProfile) filter?: Filter<UserProfile>,
  ): Promise<UserProfile[]> {
    return this.userProfileRepository.find(filter);
  }

  @patch('/user-profiles')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'user'],
    voters: [basicAuthorization],
  })
  @response(200, {
    description: 'UserProfile PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProfile, {partial: true}),
        },
      },
    })
    userProfile: UserProfile,
    @param.where(UserProfile) where?: Where<UserProfile>,
  ): Promise<Count> {
    return this.userProfileRepository.updateAll(userProfile, where);
  }

  @get('/user-profiles/{id}')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'user'],
    voters: [basicAuthorization],
  })
  @response(200, {
    description: 'UserProfile model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserProfile, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserProfile, {exclude: 'where'}) filter?: FilterExcludingWhere<UserProfile>
  ): Promise<UserProfile> {
    return this.userProfileRepository.findById(id, filter);
  }

  @patch('/user-profiles/{id}')
  @response(204, {
    description: 'UserProfile PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserProfile, {partial: true}),
        },
      },
    })
    userProfile: UserProfile,
  ): Promise<void> {
    await this.userProfileRepository.updateById(id, userProfile);
  }

  @put('/user-profiles/{id}')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'user'],
    voters: [basicAuthorization],
  })
  @response(204, {
    description: 'UserProfile PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userProfile: UserProfile,
  ): Promise<void> {
    await this.userProfileRepository.replaceById(id, userProfile);
  }

  @del('/user-profiles/{id}')
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  @response(204, {
    description: 'UserProfile DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userProfileRepository.deleteById(id);
  }
}
