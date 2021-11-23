import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';

import { RaceCarService } from '../service/race-car';
import { RaceCarDTO } from '../dto/race-car';
import { RaceCar } from '../entity/RaceCar';
import { RaceCarMapper } from '../helpers/mapper/race-car';

@injectable()
class RaceCarController extends HapiController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.RaceCarMapper) private raceCarMapper: RaceCarMapper,
    @inject(TYPES.RaceCarService) private raceCarService: RaceCarService)
  {
      super();
      this.logger.info('Created controller RaceCarController');
  }

/**
 * Get all race_car
 */
  @HapiRoute({
    method: 'GET',
    path: 'race-cars',
    options: {
      validate: { },
      description: 'Get all race car',
      tags: ['RaceCar'],
      auth: false
    }
  })
  public async getRaceCar(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.raceCarService.findAll());
  }

/**
 * Update an existing race_car
 */
  @HapiRoute({
    method: 'PUT',
    path: 'race-cars/{raceCarId}',
    options: {
      validate: {
        params: {
          raceCarId: Joi.string().length(36).required()
        }
      },
      description: 'Update an existing race car',
      tags: ['RaceCar'],
      auth: false
    }
  })
  public async updateRaceCar(request: Request, toolkit: ResponseToolkit) {
    const item = await this.raceCarService.findById(request.params.raceCarId);
    if (!item) {
      throw Boom.notFound();
    }
    const payload: RaceCar = this.raceCarMapper.map(RaceCarDTO, RaceCar, request.payload);
    payload.id = request.params.raceCarId;
    await this.raceCarService.save(payload);
    return toolkit.response('success');
  }

/**
 * Add a new race_car to the system
 */
  @HapiRoute({
    method: 'POST',
    path: 'race-cars',
    options: {
      validate: { },
      description: 'Add a new race car to the system',
      tags: ['RaceCar'],
      auth: false
    }
  })
  public async addRaceCar(request: Request, toolkit: ResponseToolkit) {
    const payload: RaceCar = this.raceCarMapper.map(RaceCarDTO, RaceCar, request.payload);
    await this.raceCarService.save(payload);
    return toolkit.response('success');
  }

/**
 * Find race_car by ID
 */
  @HapiRoute({
    method: 'GET',
    path: 'race-cars/{raceCarId}',
    options: {
      validate: {
        params: {
          raceCarId: Joi.string().length(36).required()
        }
      },
      description: 'Find race car by ID',
      tags: ['RaceCar'],
      auth: false
    }
  })
  public async getRaceCarById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.raceCarService.findById(request.params.raceCarId);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(item);
  }

/**
 * Delete a race_car
 */
  @HapiRoute({
    method: 'DELETE',
    path: 'race-cars/{raceCarId}',
    options: {
      validate: {
        params: {
          raceCarId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a race car',
      tags: ['RaceCar'],
      auth: false
    }
  })
  public async deleteRaceCar(request: Request, toolkit: ResponseToolkit) {
    const result = await this.raceCarService.delete(request.params.raceCarId);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response('success');
  }

}

export { RaceCarController }
