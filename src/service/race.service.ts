import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Race } from '../entity/race'

@injectable()
class RaceService extends CrudService<Race> {
  constructor(
    @inject(TYPES.RaceRepository) repository: Repository<Race>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger)
    this.logger.info('Created RaceService')
  }

  public async getResults(id: string, queryObject?: {}): Promise<Race | undefined> {
    const conditionsObject: {} = { id }
    queryObject && Object.assign(conditionsObject, queryObject)
    const result = await this.repository.findOne({
      where: conditionsObject,
      select: ['results'],
      relations: ['results']
    })
    return result
  }
}

export { RaceService }
