import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Team } from '../entity/team'

@injectable()
class TeamService extends CrudService<Team> {
  constructor(
    @inject(TYPES.TeamRepository) repository: Repository<Team>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger);
    this.logger.info('Created TeamService');
  }
}

export { TeamService }