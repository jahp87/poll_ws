import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PolldbDataSource} from '../datasources';
import {Poll, PollRelations, PollQuestion} from '../models';
import {PollQuestionRepository} from './poll-question.repository';

export class PollRepository extends DefaultCrudRepository<
  Poll,
  typeof Poll.prototype.id,
  PollRelations
> {

  public readonly pollQuestions: HasManyRepositoryFactory<PollQuestion, typeof Poll.prototype.id>;

  constructor(
    @inject('datasources.polldb') dataSource: PolldbDataSource, @repository.getter('PollQuestionRepository') protected pollQuestionRepositoryGetter: Getter<PollQuestionRepository>,
  ) {
    super(Poll, dataSource);
    this.pollQuestions = this.createHasManyRepositoryFactoryFor('pollQuestions', pollQuestionRepositoryGetter,);
    this.registerInclusionResolver('pollQuestions', this.pollQuestions.inclusionResolver);

  }
}
