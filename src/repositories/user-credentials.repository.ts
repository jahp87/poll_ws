import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PolldbDataSource} from '../datasources';
import {UserCredentials, UserCredentialsRelations} from '../models';




export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  constructor(
    @inject('datasources.polldb') dataSource: PolldbDataSource,
  ) {
    super(UserCredentials, dataSource);
  }
}
