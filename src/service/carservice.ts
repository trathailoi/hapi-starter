import { inject, injectable } from "inversify";
import { Car } from "../entity/car";
import { Logger } from "winston";
import { TYPES } from "../ioc/types";
import { Repository } from "typeorm";
import { CrudService } from "./crudservice";

@injectable()
class CarService extends CrudService<Car> {
    constructor(
        @inject(TYPES.CarRepository) repository: Repository<Car>,
        @inject(TYPES.Logger) logger: Logger
    ) { 
        super(repository, logger);
        this.logger.info('Created service CarService');
    }    

    public async findByMake(make: string): Promise<Array<Car>> {
        const result = await this.repository.find({ where: { make } })
        return result;
    }
}

export { CarService }