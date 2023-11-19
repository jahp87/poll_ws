import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PolldbDataSource} from '../datasources';
import {PollVote, PollVoteRelations, PollAnswer, UserProfile, PollQuestion, Poll} from '../models';
import {PollAnswerRepository} from './poll-answer.repository';
import {UserProfileRepository} from './user-profile.repository';
import {PollQuestionRepository} from './poll-question.repository';
import {PollRepository} from './poll.repository';

export class PollVoteRepository extends DefaultCrudRepository<
  PollVote,
  typeof PollVote.prototype.id,
  PollVoteRelations
> {

  public readonly pollAnswer: BelongsToAccessor<PollAnswer, typeof PollVote.prototype.id>;

  public readonly userProfile: BelongsToAccessor<UserProfile, typeof PollVote.prototype.id>;

  public readonly pollQuestion: BelongsToAccessor<PollQuestion, typeof PollVote.prototype.id>;

  public readonly poll: BelongsToAccessor<Poll, typeof PollVote.prototype.id>;

  constructor(
    @inject('datasources.polldb') dataSource: PolldbDataSource, @repository.getter('PollAnswerRepository') protected pollAnswerRepositoryGetter: Getter<PollAnswerRepository>, @repository.getter('UserProfileRepository') protected userProfileRepositoryGetter: Getter<UserProfileRepository>, @repository.getter('PollQuestionRepository') protected pollQuestionRepositoryGetter: Getter<PollQuestionRepository>, @repository.getter('PollRepository') protected pollRepositoryGetter: Getter<PollRepository>,
  ) {
    super(PollVote, dataSource);
    this.poll = this.createBelongsToAccessorFor('poll', pollRepositoryGetter,);
    this.registerInclusionResolver('poll', this.poll.inclusionResolver);
    this.pollQuestion = this.createBelongsToAccessorFor('pollQuestion', pollQuestionRepositoryGetter,);
    this.registerInclusionResolver('pollQuestion', this.pollQuestion.inclusionResolver);
    this.userProfile = this.createBelongsToAccessorFor('userProfile', userProfileRepositoryGetter,);
    this.registerInclusionResolver('userProfile', this.userProfile.inclusionResolver);
    this.pollAnswer = this.createBelongsToAccessorFor('pollAnswer', pollAnswerRepositoryGetter,);
    this.registerInclusionResolver('pollAnswer', this.pollAnswer.inclusionResolver);
  }
}
