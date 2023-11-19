import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PolldbDataSource} from '../datasources';
import {PollAnswer, PollAnswerRelations, Poll, PollQuestion} from '../models';
import {PollRepository} from './poll.repository';
import {PollQuestionRepository} from './poll-question.repository';

export class PollAnswerRepository extends DefaultCrudRepository<
  PollAnswer,
  typeof PollAnswer.prototype.id,
  PollAnswerRelations
> {

  public readonly poll: BelongsToAccessor<Poll, typeof PollAnswer.prototype.id>;

  public readonly pollQuestion: BelongsToAccessor<PollQuestion, typeof PollAnswer.prototype.id>;

  constructor(
    @inject('datasources.polldb') dataSource: PolldbDataSource, @repository.getter('PollRepository') protected pollRepositoryGetter: Getter<PollRepository>, @repository.getter('PollQuestionRepository') protected pollQuestionRepositoryGetter: Getter<PollQuestionRepository>,
  ) {
    super(PollAnswer, dataSource);
    this.pollQuestion = this.createBelongsToAccessorFor('pollQuestion', pollQuestionRepositoryGetter,);
    this.registerInclusionResolver('pollQuestion', this.pollQuestion.inclusionResolver);
    this.poll = this.createBelongsToAccessorFor('poll', pollRepositoryGetter,);
  }
}
