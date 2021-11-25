import { Request, ResponseToolkit } from '@hapi/hapi'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc/types'
import { Logger } from 'winston'
import { HapiRoute } from '../decorators/decorators'
import { HapiController } from './hapi-controller'
import * as Joi from '@hapi/joi'
import * as Boom from '@hapi/boom'
import { Mapper } from '../helpers/mapper'
import { ICarController } from './interfaces/car.interface'

import { CarService } from '../service/car.service'
import { CarModel } from '../dto/car'
import { Car } from '../entity/car'

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
class CarController extends HapiController implements ICarController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.CarService) private service: CarService,
    @inject(TYPES.Mapper) private mapper: Mapper)
  {
    super()
    this.logger.info('Created controller CarController')
  }

// #region addCar
/**
 * Add a new car to the system
 */
  @HapiRoute({
    method: 'POST',
    path: 'cars',
    options: {
      validate: { },
      description: 'Add a new car to the system',
      tags: ['car'],
      auth: false
    }
  })
  public async addCar(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
  }
// #endregion

// #region findCars
/**
 * Finds all the cars
 */
  @HapiRoute({
    method: 'GET',
    path: 'cars',
    options: {
      validate: { },
      description: 'Finds Cars',
      tags: ['car'],
      auth: false
    }
  })
  public async findCars(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
  }
// #endregion

// #region getCarById
/**
 * Returns a single car
 */
  @HapiRoute({
    method: 'GET',
    path: 'cars/{id}',
    options: {
      validate: { },
      description: 'Find car by ID',
      tags: ['car'],
      auth: false
    }
  })
  public async getCarById(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
  }
// #endregion

// #region updateCar
/**
 * Updates an existing car by ID
 */
  @HapiRoute({
    method: 'PATCH',
    path: 'cars/{id}',
    options: {
      validate: { },
      description: 'Updates an existing car by ID',
      tags: ['car'],
      auth: false
    }
  })
  public async updateCar(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
  }
// #endregion

// #region deleteCar
/**
 * Deletes a car by ID
 */
  @HapiRoute({
    method: 'DELETE',
    path: 'cars/{id}',
    options: {
      validate: { },
      description: 'Deletes a car by ID',
      tags: ['car'],
      auth: false
    }
  })
  public async deleteCar(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
  }
// #endregion

// #region getCarResults
/**
 * Get a car's results
 */
  @HapiRoute({
    method: 'GET',
    path: 'cars/{id}/results',
    options: {
      validate: { },
      description: 'Get a car\'s results',
      tags: ['car','race-result'],
      auth: false
    }
  })
  public async getCarResults(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
  }
// #endregion

}

export { CarController }
