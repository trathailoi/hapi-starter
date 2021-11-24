import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Car } from '../entity/car'

@injectable()
class CarService extends CrudService<Car> {
  constructor(
    @inject(TYPES.CarRepository) repository: Repository<Car>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger);
    this.logger.info('Created CarService');
  }
}

export { CarService }