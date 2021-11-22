import { Request, ResponseToolkit } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc/types";
import { Logger } from "winston";
import { HapiRoute } from "../decorators/decorators";
import { HapiController } from "./hapi-controller";
import * as Joi from '@hapi/joi';
import * as Boom from "@hapi/boom";
import { Mapper } from "../helpers/mapper";
import { IRace-carsController } from './interfaces/race-cars.interface';
import { RaceCarModel } from '../model/models';

/**
 * This file is automatically generated by swagger.  This is a stub.  It is expected that developers will fill in the logic
 * for each method - as generated each endpoint will return a 501 - not implemented.
 *
 * IT IS NOT SAFE TO OVERWRITE AN EXISTING FILE WITH THIS ONE.
 *
 * If there are changes to the swagger that describes routes implemented in this controller, the related interface will
 * change and the TypeScript compiler will complain that the controller does not implement the interface correctly.  In
 * this case, you can find the missing (added) method(s) in the generated controller and copy the stubs to your implementation.
 */
@injectable()
class Race-carsController extends HapiController implements IRace-carsController {

  /**
   * Here we are also injecting the car service to manage interactions with the database
   * in addition to the logger and mapper.  You can inject as many dependencies as you need.
   *
   * This is a test.
   */
  constructor(
      @inject(TYPES.Logger) private logger: Logger,
      @inject(TYPES.Mapper) private mapper: Mapper)
  {
      super();
      this.logger.info('Created controller Race-carsController');
  }

/**
 * Get all race_car
 */
  @HapiRoute({
    method: 'GET',
    path: '/race-cars',
    options: {
      validate: { },
      description: 'Get all race_car',
      tags: ['RaceCar'],
      auth: false
    }
  })
  public async getRaceCar(request: Request, toolkit: ResponseToolkit) {
   return toolkit.response().code(501);
  }

/**
 * Update an existing race_car
 */
  @HapiRoute({
    method: 'PUT',
    path: '/race-cars',
    options: {
      validate: { },
      description: 'Update an existing race_car',
      tags: ['RaceCar'],
      auth: false
    }
  })
  public async updateRaceCar(request: Request, toolkit: ResponseToolkit) {
   return toolkit.response().code(501);
  }

/**
 * Add a new race_car to the store
 */
  @HapiRoute({
    method: 'POST',
    path: '/race-cars',
    options: {
      validate: { },
      description: 'Add a new race_car to the store',
      tags: ['RaceCar'],
      auth: false
    }
  })
  public async addRaceCar(request: Request, toolkit: ResponseToolkit) {
   return toolkit.response().code(501);
  }

/**
 * Find race_car by ID
 */
  @HapiRoute({
    method: 'GET',
    path: '/race-cars/{raceCarId}',
    options: {
      validate: { },
      description: 'Find race_car by ID',
      tags: ['RaceCar'],
      auth: false
    }
  })
  public async getRaceCarById(request: Request, toolkit: ResponseToolkit) {
   return toolkit.response().code(501);
  }

/**
 * Delete a race_car
 */
  @HapiRoute({
    method: 'DELETE',
    path: '/race-cars/{raceCarId}',
    options: {
      validate: { },
      description: 'Delete a race_car',
      tags: ['RaceCar'],
      auth: false
    }
  })
  public async deleteRaceCar(request: Request, toolkit: ResponseToolkit) {
   return toolkit.response().code(501);
  }

}

export { Race-carsController }