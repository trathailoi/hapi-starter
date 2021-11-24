import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Driver } from '../entity/driver'

@injectable()
class DriverService extends CrudService<Driver> {
  constructor(
    @inject(TYPES.DriverRepository) repository: Repository<Driver>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger);
    this.logger.info('Created DriverService');
  }
}

export { DriverService }