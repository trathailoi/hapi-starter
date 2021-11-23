import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';

import { DriverService } from '../service/driver';
import { DriverDTO } from '../dto/driver';

@injectable()
class DriverController extends HapiController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.DriverService) private driverService: DriverService) {
    super();
    this.logger.info('Created controller DriverController');
  }

  /**
   * Get all driver
   */
  @HapiRoute({
    method: 'GET',
    path: 'drivers',
    options: {
      validate: {},
      description: 'Get all driver',
      tags: ['Driver'],
      auth: false
    }
  })
  public async getDrivers(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.driverService.findAll());
  }

  /**
   * Update an existing driver
   */
  @HapiRoute({
    method: 'PUT',
    path: 'drivers/{driverId}',
    options: {
      validate: {
        params: {
          driverId: Joi.string().length(36).required()
        },
        payload: {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          nationality: Joi.string().required().valid('USA', 'Viet Nam'),
          homeAddress: Joi.string().length(36).allow(null),
          managementAddress: Joi.string().length(36).allow(null)
        }
      },
      description: 'Update an existing driver',
      tags: ['Driver'],
      auth: false
    }
  })
  public async updateDriver(request: Request, toolkit: ResponseToolkit) {
    const payload: DriverDTO = request.payload as DriverDTO;
    const item = await this.driverService.findById(request.params.driverId);
    if (!item) {
      throw Boom.notFound();
    }
    payload.id = request.params.driverId;
    await this.driverService.save(payload);
    return toolkit.response('success');
  }

  /**
   * Add a new driver to the store
   */
  @HapiRoute({
    method: 'POST',
    path: 'drivers',
    options: {
      validate: {
        payload: {
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          nationality: Joi.string().required().valid('USA', 'Viet Nam'),
          homeAddress: Joi.string().length(36).allow(null),
          managementAddress: Joi.string().length(36).allow(null)
        }
      },
      description: 'Add a new driver to the store',
      tags: ['Driver'],
      auth: false
    }
  })
  public async addDriver(request: Request, toolkit: ResponseToolkit) {
    const payload: DriverDTO = request.payload as DriverDTO;
    await this.driverService.save(payload);
    return toolkit.response('success');
  }

  /**
   * Find driver by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'drivers/{driverId}',
    options: {
      validate: {
        params: {
          driverId: Joi.string().length(36).required()
        }
      },
      description: 'Find driver by ID',
      tags: ['Driver'],
      auth: false
    }
  })
  public async getDriverById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.driverService.findById(request.params.driverId);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(item);
  }

  /**
   * Delete a driver
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'drivers/{driverId}',
    options: {
      validate: {
        params: {
          driverId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a driver',
      tags: ['Driver'],
      auth: false
    }
  })
  public async deleteDriver(request: Request, toolkit: ResponseToolkit) {
    const result = await this.driverService.delete(request.params.driverId);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response('success');
  }

}

export { DriverController }
