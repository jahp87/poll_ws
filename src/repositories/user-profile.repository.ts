import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {PolldbDataSource} from '../datasources';
import {UserProfile, UserProfileRelations, User, Poll, ProfilePoll} from '../models';
import {UserRepository} from './user.repository';
import {ProfilePollRepository} from './profile-poll.repository';
import {PollRepository} from './poll.repository';

export class UserProfileRepository extends DefaultCrudRepository<
  UserProfile,
  typeof UserProfile.prototype.id,
  UserProfileRelations
> {

  public readonly user: BelongsToAccessor<User, typeof UserProfile.prototype.id>;

  public readonly polls: HasManyThroughRepositoryFactory<Poll, typeof Poll.prototype.id,
          ProfilePoll,
          typeof UserProfile.prototype.id
        >;

  constructor(
    @inject('datasources.polldb') dataSource: PolldbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ProfilePollRepository') protected profilePollRepositoryGetter: Getter<ProfilePollRepository>, @repository.getter('PollRepository') protected pollRepositoryGetter: Getter<PollRepository>,
  ) {
    super(UserProfile, dataSource);
    this.polls = this.createHasManyThroughRepositoryFactoryFor('polls', pollRepositoryGetter, profilePollRepositoryGetter,);
    this.registerInclusionResolver('polls', this.polls.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
