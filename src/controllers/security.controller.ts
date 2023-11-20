// Uncomment these imports to begin using these cool features!

import {TokenService, UserService} from '@loopback/authentication';
import {TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, SchemaObject, post, requestBody} from '@loopback/rest';
import _ from 'lodash';
import {PasswordHasherBindings} from '../keys';
import {User} from '../models';
import {Credentials, UserCredentialsRepository, UserRepository} from '../repositories';
import {PasswordHasher} from '../services';

// import {inject} from '@loopback/core';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class SecurityController {
  constructor(
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(UserCredentialsRepository) public userCredentialsRepository: UserCredentialsRepository,
  ) { }

  @post('/api/security/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @post('/security/sign-up/user', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signupUser(
    @requestBody(CredentialsRequestBody) newUserRequest: Credentials,
  ): Promise<User> {
    newUserRequest.role = 'user';

    return this.sigup(newUserRequest);
  }

  @post('/security/sign-up/admin', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signupAdmin(
    @requestBody(CredentialsRequestBody) newUserRequest: Credentials,
  ): Promise<User> {
    newUserRequest.role = 'admin';


    return this.sigup(newUserRequest);


  }

  @post('/security/sign-up/poweruser', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signupPowerUser(
    @requestBody(CredentialsRequestBody) newUserRequest: Credentials,
  ): Promise<User> {
    newUserRequest.role = 'power';


    return this.sigup(newUserRequest);


  }

  async sigup(credentials: Credentials): Promise<User> {

    // encrypt the password
    const password = await this.passwordHasher.hashPassword(
      credentials.password,
    );

    const isUniqueUser = await this.userRepository.findOne({where: {email: credentials.email}});

    if (isUniqueUser !== null) {
      throw new HttpErrors.BadRequest('email value is already taken');
    }


    try {
      // create the new user
      const savedUser = await this.userRepository.create(
        _.omit(credentials, 'password'),
      );



      // set the password
      await this.userRepository
        .userCredentials(savedUser.id)
        .create({password});

      return savedUser;
    } catch (error) {
      // MongoError 11000 duplicate key

      throw new HttpErrors.Conflict('Email value is already taken');

    }
  }
}
