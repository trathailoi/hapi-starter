import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { RaceResult } from '../entity/race-result'

@injectable()
class RaceResultService extends CrudService<RaceResult> {
  constructor(
    @inject(TYPES.RaceResultRepository) repository: Repository<RaceResult>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger)
    this.logger.info('Created RaceResultService')
  }

  public async findById(id: string): Promise<RaceResult | undefined> {
    const result = await this.repository.findOne({
      where: { id },
      relations: ['car', 'race', 'driver', 'class']
    })
    return result
  }

  public async findAll(queryObject?: {where?: {}, relations?: string[], pagination?: {}}): Promise<{data: Array<RaceResult>, count: number}> {
    return super.findAll({ relations : ['car', 'race', 'driver', 'class'], ...queryObject })
  }

}

export { RaceResultService }
