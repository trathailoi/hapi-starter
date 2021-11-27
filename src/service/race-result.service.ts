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

  public async saveMany(entities: Array<RaceResult>): Promise<Array<RaceResult>> {
    const result = await this.repository.save(entities)
    return result
  }


  public async findAll(queryObject?: {}): Promise<Array<RaceResult>> {
    let conditionsObject: {} = { }
    queryObject && (conditionsObject = Object.assign(conditionsObject, queryObject))
    const result = await this.repository.find({
      where: conditionsObject,
      relations: ['car', 'race', 'driver', 'class']
    })
    return result
  }
  
  public async findByRace(raceId: string, queryObject?: {}): Promise<Array<RaceResult>> {
    let conditionsObject: {} = { race: raceId }
    queryObject && (conditionsObject = Object.assign(conditionsObject, queryObject))
    const result = await this.repository.find({
      where: conditionsObject,
      relations: ['car', 'race', 'driver', 'class']
    })
    return result
  }
  
  public async findByDriver(driverId: string, queryObject?: {}): Promise<Array<RaceResult>> {
    let conditionsObject: {} = { driver: driverId }
    queryObject && (conditionsObject = Object.assign(conditionsObject, queryObject))
    const result = await this.repository.find({
      where: conditionsObject,
      relations: ['car', 'race', 'driver', 'class']
    })
    return result
  }
  
  public async findByCar(carId: string, queryObject?: {}): Promise<Array<RaceResult>> {
    let conditionsObject: {} = { car: carId }
    queryObject && (conditionsObject = Object.assign(conditionsObject, queryObject))
    const result = await this.repository.find({
      where: conditionsObject,
      relations: ['car', 'race', 'driver', 'class']
    })
    return result
  }

}

export { RaceResultService }
