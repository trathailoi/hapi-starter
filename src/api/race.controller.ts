import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';

import { RaceService } from '../service/race';
import { RaceDTO } from '../dto/race';

@injectable()
class RaceController extends HapiController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.RaceService) private raceService: RaceService) {
    super();
    this.logger.info('Created controller RaceController');
  }

  /**
   * Get all race
   */
  @HapiRoute({
    method: 'GET',
    path: 'races',
    options: {
      validate: {},
      description: 'Get all race',
      tags: ['Race'],
      auth: false
    }
  })
  public async getRaces(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.raceService.findAll());
  }

  /**
   * Update an existing race
   */
  @HapiRoute({
    method: 'PUT',
    path: 'races',
    options: {
      validate: {
        payload: {
          id: Joi.string().length(36).required(),
          name: Joi.string().required()
        }
      },
      description: 'Update an existing race',
      tags: ['Race'],
      auth: false
    }
  })
  public async updateRace(request: Request, toolkit: ResponseToolkit) {
    const payload: RaceDTO = request.payload as RaceDTO;
    const item = await this.raceService.findById(payload.id);
    if (!item) {
      throw Boom.notFound();
    }
    await this.raceService.save(payload);
    return toolkit.response('success');
  }

  /**
   * Add a new race to the store
   */
  @HapiRoute({
    method: 'POST',
    path: 'races',
    options: {
      validate: {
        payload: {
          name: Joi.string().required()
        }
      },
      description: 'Add a new race to the store',
      tags: ['Race'],
      auth: false
    }
  })
  public async addRace(request: Request, toolkit: ResponseToolkit) {
    const payload: RaceDTO = request.payload as RaceDTO;
    await this.raceService.save(payload);
    return toolkit.response('success');
  }

  /**
   * Find race by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'races/{raceId}',
    options: {
      validate: {
        params: {
          addressId: Joi.string().length(36).required()
        }
      },
      description: 'Find race by ID',
      tags: ['Race'],
      auth: false
    }
  })
  public async getRaceById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.raceService.findById(request.params.raceId);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(item);
  }

  /**
   * Delete a race
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'races/{raceId}',
    options: {
      validate: {
        params: {
          addressId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a race',
      tags: ['Race'],
      auth: false
    }
  })
  public async deleteRace(request: Request, toolkit: ResponseToolkit) {
    const result = await this.raceService.delete(request.params.raceId);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response('success');
  }

}

export { RaceController }
