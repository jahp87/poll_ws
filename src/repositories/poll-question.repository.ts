import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PolldbDataSource} from '../datasources';
import {PollQuestion, PollQuestionRelations, PollVote} from '../models';
import {PollVoteRepository} from './poll-vote.repository';

export class PollQuestionRepository extends DefaultCrudRepository<
  PollQuestion,
  typeof PollQuestion.prototype.id,
  PollQuestionRelations
> {

  public readonly pollVote: BelongsToAccessor<PollVote, typeof PollQuestion.prototype.id>;

  constructor(
    @inject('datasources.polldb') dataSource: PolldbDataSource, @repository.getter('PollVoteRepository') protected pollVoteRepositoryGetter: Getter<PollVoteRepository>,
  ) {
    super(PollQuestion, dataSource);
    this.pollVote = this.createBelongsToAccessorFor('pollVote', pollVoteRepositoryGetter,);
    this.registerInclusionResolver('pollVote', this.pollVote.inclusionResolver);
  }
}
