import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {basicAuthorization} from '../middlewares/auth.midd';
import {
  PollAnswer,
  PollQuestion,
} from '../models';
import {PollAnswerRepository} from '../repositories';

export class PollAnswerPollQuestionController {
  constructor(
    @repository(PollAnswerRepository)
    public pollAnswerRepository: PollAnswerRepository,
  ) { }

  @get('/poll-answers/{id}/poll-question', {
    responses: {
      '200': {
        description: 'PollQuestion belonging to PollAnswer',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PollQuestion),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'power'],
    voters: [basicAuthorization],
  })
  async getPollQuestion(
    @param.path.string('id') id: typeof PollAnswer.prototype.id,
  ): Promise<PollQuestion> {
    return this.pollAnswerRepository.pollQuestion(id);
  }
}
