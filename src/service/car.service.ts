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

  public async findById(id: string): Promise<Car | undefined> {
    const result = await this.repository.findOne({
      where: { id },
      relations: ['class', 'team'] // , 'results'
    })
    return result
  }

  public async findAll(queryObject?: {where?: {}, relations?: string[], pagination?: {}}): Promise<{data: Array<Car>, count: number}> {
    return super.findAll({ relations : ['class', 'team'], ...queryObject }) // , 'results'
  }
}

export { CarService }
