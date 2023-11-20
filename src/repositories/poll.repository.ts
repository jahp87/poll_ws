import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PolldbDataSource} from '../datasources';
import {Poll, PollRelations, PollQuestion, PollAnswer, PollVote} from '../models';
import {PollQuestionRepository} from './poll-question.repository';
import {PollAnswerRepository} from './poll-answer.repository';
import {PollVoteRepository} from './poll-vote.repository';

export class PollRepository extends DefaultCrudRepository<
  Poll,
  typeof Poll.prototype.id,
  PollRelations
> {

  public readonly pollQuestions: HasManyRepositoryFactory<PollQuestion, typeof Poll.prototype.id>;

  public readonly pollAnswers: HasManyRepositoryFactory<PollAnswer, typeof Poll.prototype.id>;

  public readonly pollVotes: HasManyRepositoryFactory<PollVote, typeof Poll.prototype.id>;

  constructor(
    @inject('datasources.polldb') dataSource: PolldbDataSource, @repository.getter('PollQuestionRepository') protected pollQuestionRepositoryGetter: Getter<PollQuestionRepository>, @repository.getter('PollAnswerRepository') protected pollAnswerRepositoryGetter: Getter<PollAnswerRepository>, @repository.getter('PollVoteRepository') protected pollVoteRepositoryGetter: Getter<PollVoteRepository>,
  ) {
    super(Poll, dataSource);
    this.pollVotes = this.createHasManyRepositoryFactoryFor('pollVotes', pollVoteRepositoryGetter,);
    this.registerInclusionResolver('pollVotes', this.pollVotes.inclusionResolver);
    this.pollAnswers = this.createHasManyRepositoryFactoryFor('pollAnswers', pollAnswerRepositoryGetter,);
    this.registerInclusionResolver('pollAnswers', this.pollAnswers.inclusionResolver);
    this.pollQuestions = this.createHasManyRepositoryFactoryFor('pollQuestions', pollQuestionRepositoryGetter,);
    this.registerInclusionResolver('pollQuestions', this.pollQuestions.inclusionResolver);

  }
}
