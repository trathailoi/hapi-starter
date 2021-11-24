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
import { Race } from '../entity/Race';
import { RaceMapper } from '../helpers/mapper/race';
import { RaceResultService } from '../service/race-result';

@injectable()
class RaceController extends HapiController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.RaceMapper) private raceMapper: RaceMapper,
    @inject(TYPES.RaceService) private raceService: RaceService,
    @inject(TYPES.RaceResultService) private raceResultService: RaceResultService) {
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
    path: 'races/{raceId}',
    options: {
      validate: {
        params: {
          raceId: Joi.string().length(36).required()
        },
        payload: {
          name: Joi.string().required(),
          raceResults: Joi.array().items(Joi.object().keys({
            car: Joi.string().length(36).required(),
            driver: Joi.string().length(36).required(),
            class: Joi.string().length(36).required(),
            raceNumber: Joi.string().required(),
            startPosition: Joi.number().required(),
            finishPosition: Joi.number().allow(null),
          }))
        }
      },
      description: 'Update an existing race',
      tags: ['Race'],
      auth: false
    }
  })
  public async updateRace(request: Request, toolkit: ResponseToolkit) {
    const item = await this.raceService.findById(request.params.raceId);
    if (!item) {
      throw Boom.notFound();
    }
    const payload: Race = this.raceMapper.map(RaceDTO, Race, request.payload);
    payload.id = request.params.raceId;
    await this.raceService.save(payload);
    if (payload.raceResults) {
      const raceResults = payload.raceResults.map(raceResult => ({...raceResult, race: request.params.raceId}))
      await this.raceResultService.save(raceResults)
    }
    return toolkit.response('success');
  }

  /**
   * Add a new race to the system
   */
  @HapiRoute({
    method: 'POST',
    path: 'races',
    options: {
      validate: {
        payload: {
          name: Joi.string().required(),
          raceResults: Joi.array().items(Joi.object().keys({
            car: Joi.string().length(36).required(),
            driver: Joi.string().length(36).required(),
            class: Joi.string().length(36).required(),
            raceNumber: Joi.string().required(),
            startPosition: Joi.number().required(),
            finishPosition: Joi.number().allow(null),
          }))
        }
      },
      description: 'Add a new race to the system',
      tags: ['Race'],
      auth: false
    }
  })
  public async addRace(request: Request, toolkit: ResponseToolkit) {
    const payload: Race = this.raceMapper.map(RaceDTO, Race, request.payload);
    const race = await this.raceService.save(payload);
    if (payload.raceResults) {
      const raceResults = payload.raceResults.map(raceResult => ({...raceResult, race: race?.id}))
      await this.raceResultService.save(raceResults)
    }
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
          raceId: Joi.string().length(36).required()
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
          raceId: Joi.string().length(36).required()
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

  /**
   * All race results for that race
   */
  @HapiRoute({
    method: 'GET',
    path: 'races/{raceId}/results',
    options: {
      validate: {
        params: {
          raceId: Joi.string().length(36).required()
        }
      },
      description: 'All race results for that race',
      tags: ['Race'],
      auth: false
    }
  })
  public async getRaceResultByRaceId(request: Request, toolkit: ResponseToolkit) {
    const item = await this.raceService.findById(request.params.raceId);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(await this.raceResultService.findByQuery({ race: request.params.raceId }));
  }

}

export { RaceController }
