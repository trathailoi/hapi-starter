import { inject, injectable } from "inversify";
import { Logger } from "winston";
import { DeleteResult, Repository } from "typeorm";
import { Address } from "../entity/Address";
import { TYPES } from "../ioc/types";
import { CrudService } from "./crudservice";

@injectable()
class AddressService extends CrudService<Address> {
    constructor(
      @inject(TYPES.AddressRepository) repository: Repository<Address>,
      @inject(TYPES.Logger) logger: Logger
    ) {
      super(repository, logger);
      this.logger.info('Created CarService');
    }
}

export { AddressService }
