import { Request, ResponseToolkit } from '@hapi/hapi'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc/types'
import { Logger } from 'winston'
import { HapiRoute } from '../decorators/decorators'
import { HapiController } from './hapi-controller'
import * as Joi from '@hapi/joi'
import * as Boom from '@hapi/boom'
import { Mapper } from '../helpers/mapper'
import { IDriverController } from './interfaces/driver.interface'

import { DriverService } from '../service/driver.service'
import { DriverModel } from '../dto/driver'
import { Driver } from '../entity/driver'

import { RaceResultService } from '../service/race-result.service'

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
class DriverController extends HapiController implements IDriverController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.DriverService) private service: DriverService,
    @inject(TYPES.RaceResultService) private raceResultService: RaceResultService,
    @inject(TYPES.Mapper) private mapper: Mapper)
  {
    super()
    this.logger.info('Created controller DriverController')
  }

// #region addDriver
/**
 * Add a new driver to the system
 */
  @HapiRoute({
    method: 'POST',
    path: 'drivers',
    options: {
      validate: {
        payload: {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          nationality: Joi.string().valid('USA', 'Viet Nam'),
          teams: Joi.array().items(Joi.string().guid()),
          homeAddress: Joi.string().guid(),
          managementAddress: Joi.string().guid()
        }
      },
      description: 'Add a new driver to the system',
      tags: ['driver'],
      auth: false
    }
  })
  public async addDriver(request: Request, toolkit: ResponseToolkit) {
    const payload: Driver = this.mapper.map(DriverModel, Driver, request.payload)
    const item = await this.service.save(payload)
    return toolkit.response({id: item!.id}).code(201)
  }
// #endregion

// #region findDrivers
/**
 * Finds all the drivers
 */
  @HapiRoute({
    method: 'GET',
    path: 'drivers',
    options: {
      validate: {
        query: {
          currentPage: Joi.number().integer().min(1).optional().description('offset for pagination'),
          pageSize: Joi.number().integer().min(1).optional().description('items per page')
        }
      },
      description: 'Finds Drivers',
      tags: ['driver'],
      auth: false
    }
  })
  public async findDrivers(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.service.findAll({
      pagination: {
        pageSize: request.query.pageSize,
        currentPage: request.query.currentPage
      }
    }))
  }
// #endregion

// #region getDriverById
/**
 * Returns a single driver
 */
  @HapiRoute({
    method: 'GET',
    path: 'drivers/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        }
      },
      description: 'Find driver by ID',
      tags: ['driver'],
      auth: false
    }
  })
  public async getDriverById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.service.findById(request.params.id)
    if (!item) {
      throw Boom.notFound()
    }
    return toolkit.response(item)
  }
// #endregion

// #region updateDriver
/**
 * Updates an existing driver by ID
 */
  @HapiRoute({
    method: 'PATCH',
    path: 'drivers/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        },
        payload: {
          firstName: Joi.string(),
          lastName: Joi.string(),
          nationality: Joi.string().valid('USA', 'Viet Nam'),
          teams: Joi.array().items(Joi.string().guid()),
          homeAddress: Joi.string().guid(),
          managementAddress: Joi.string().guid()
        }
      },
      description: 'Updates an existing driver by ID',
      tags: ['driver'],
      auth: false
    }
  })
  public async updateDriver(request: Request, toolkit: ResponseToolkit) {
    const payload: Driver = this.mapper.map(DriverModel, Driver, Object.assign({}, request.payload, request.params))
    const item = await this.service.findById(payload.id)
    if (!item) {
      throw Boom.notFound()
    }
    await this.service.save(payload)
    return toolkit.response().code(204)
  }
// #endregion

// #region deleteDriver
/**
 * Deletes a driver by ID
 */
  @HapiRoute({
    method: 'DELETE',
    path: 'drivers/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        }
      },
      description: 'Deletes a driver by ID',
      tags: ['driver'],
      auth: false
    }
  })
  public async deleteDriver(request: Request, toolkit: ResponseToolkit) {
    const result = await this.service.delete(request.params.id)
    if (!result.affected) {
      throw Boom.notFound()
    }
    return toolkit.response().code(204)
  }
// #endregion

// #region getDriverRaceResults
/**
 * Get driver's results on races
 */
  @HapiRoute({
    method: 'GET',
    path: 'drivers/{id}/results',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        },
        query: {
          currentPage: Joi.number().integer().min(1).optional().description('offset for pagination'),
          pageSize: Joi.number().integer().min(1).optional().description('items per page'),
          raceId: Joi.string().guid().description('of a specific race'),
          carId: Joi.string().guid().description('of a specific car')
        }
      },
      description: 'Get driver\'s results on races',
      tags: ['driver', 'race-result'],
      auth: false
    }
  })
  public async getDriverRaceResults(request: Request, toolkit: ResponseToolkit) {
    const queryObj: {
      pagination?: {pageSize?: number, currentPage?: number},
      where: {driver: string, race?: string, car?: string}
    } = {
      pagination: {
        pageSize: request.query.pageSize,
        currentPage: request.query.currentPage
      },
      where: {
        driver: request.params.id
      }
    }
    if (request.query.raceId || request.query.carId) {
      request.query.raceId && (queryObj.where.race = request.query.raceId)
      request.query.carId && (queryObj.where.car = request.query.carId)
    }
    return toolkit.response(await this.raceResultService.findAll(queryObj))
  }
// #endregion

}

export { DriverController }