import { inject, injectable } from "inversify";
import { Logger } from "winston";
import { Repository } from "typeorm";
import { TYPES } from "../ioc/types";
import { CrudService } from "./crudservice";
import { RaceCar } from "../entity/RaceCar";

@injectable()
class RaceCarService extends CrudService<RaceCar> {
  constructor(
    @inject(TYPES.RaceCarRepository) repository: Repository<RaceCar>,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger);
    this.logger.info('Created RaceCarService');
  }

  public async findById(id: string): Promise<RaceCar | undefined> {
    const result = await this.repository.findOne({
      where: { id },
      relations: ['race', 'car', 'car.class', 'driver', 'driver.homeAddress', 'driver.managementAddress', 'class']
    })
    return result;
  }

  public async findAll(): Promise<Array<RaceCar>> {
    const result = await this.repository.find({
      relations: ['race', 'car', 'car.class', 'driver', 'driver.homeAddress', 'driver.managementAddress', 'class']
    });
    return result;
  }
}

export { RaceCarService }
