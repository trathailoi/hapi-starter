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
    super(repository, logger)
    this.logger.info('Created CarService')
  }

  public async findAll(queryObject?: {}): Promise<Array<Car>> {
    const result = await this.repository.find(queryObject ? { where: queryObject } : {})
    return result
  }

  public async findResultsById(id: string, queryObject?: {}): Promise<Car | undefined> {
    const conditionsObject: {} = {
      id
    }
    queryObject && Object.assign(conditionsObject, queryObject)
    const result = await this.repository.findOne({
      where: conditionsObject,
      select: ['results'],
      relations: ['results']
    })
    return result
  }

}

export { CarService }
