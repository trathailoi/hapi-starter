import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';

import { RaceResultService } from '../service/race-result';
import { RaceResultDTO } from '../dto/race-result';
import { RaceResult } from '../entity/RaceResult';
import { RaceResultMapper } from '../helpers/mapper/race-result';

@injectable()
class RaceResultController extends HapiController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.RaceResultMapper) private RaceResultMapper: RaceResultMapper,
    @inject(TYPES.RaceResultService) private RaceResultService: RaceResultService)
  {
      super();
      this.logger.info('Created controller RaceResultController');
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
      tags: ['RaceResult'],
      auth: false
    }
  })
  public async getRaceResult(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.RaceResultService.findAll());
  }

/**
 * Update an existing race_car
 */
  @HapiRoute({
    method: 'PUT',
    path: 'race-cars/{RaceResultId}',
    options: {
      validate: {
        params: {
          RaceResultId: Joi.string().length(36).required()
        }
      },
      description: 'Update an existing race car',
      tags: ['RaceResult'],
      auth: false
    }
  })
  public async updateRaceResult(request: Request, toolkit: ResponseToolkit) {
    const item = await this.RaceResultService.findById(request.params.RaceResultId);
    if (!item) {
      throw Boom.notFound();
    }
    const payload: RaceResult = this.RaceResultMapper.map(RaceResultDTO, RaceResult, request.payload);
    payload.id = request.params.RaceResultId;
    await this.RaceResultService.save(payload);
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
      tags: ['RaceResult'],
      auth: false
    }
  })
  public async addRaceResult(request: Request, toolkit: ResponseToolkit) {
    const payload: RaceResult = this.RaceResultMapper.map(RaceResultDTO, RaceResult, request.payload);
    await this.RaceResultService.save(payload);
    return toolkit.response('success');
  }

/**
 * Find race_car by ID
 */
  @HapiRoute({
    method: 'GET',
    path: 'race-cars/{RaceResultId}',
    options: {
      validate: {
        params: {
          RaceResultId: Joi.string().length(36).required()
        }
      },
      description: 'Find race car by ID',
      tags: ['RaceResult'],
      auth: false
    }
  })
  public async getRaceResultById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.RaceResultService.findById(request.params.RaceResultId);
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
    path: 'race-cars/{RaceResultId}',
    options: {
      validate: {
        params: {
          RaceResultId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a race car',
      tags: ['RaceResult'],
      auth: false
    }
  })
  public async deleteRaceResult(request: Request, toolkit: ResponseToolkit) {
    const result = await this.RaceResultService.delete(request.params.RaceResultId);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response('success');
  }

}

export { RaceResultController }
