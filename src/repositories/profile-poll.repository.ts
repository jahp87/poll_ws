import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PolldbDataSource} from '../datasources';
import {ProfilePoll, ProfilePollRelations} from '../models';

export class ProfilePollRepository extends DefaultCrudRepository<
  ProfilePoll,
  typeof ProfilePoll.prototype.id,
  ProfilePollRelations
> {
  constructor(
    @inject('datasources.polldb') dataSource: PolldbDataSource,
  ) {
    super(ProfilePoll, dataSource);
  }
}
