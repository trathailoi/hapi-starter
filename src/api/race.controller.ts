import { Request, ResponseToolkit } from '@hapi/hapi'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc/types'
import { Logger } from 'winston'
import { HapiRoute } from '../decorators/decorators'
import { HapiController } from './hapi-controller'
import * as Joi from '@hapi/joi'
import * as Boom from '@hapi/boom'
import { Mapper } from '../helpers/mapper'
import { IRaceController } from './interfaces/race.interface'

import { RaceService } from '../service/race.service'
import { RaceModel } from '../dto/race'
import { Race } from '../entity/race'

import { RaceResultService } from '../service/race-result.service'
import { RaceResultModel } from '../dto/race-result'
import { RaceResult } from '../entity/race-result'

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
class RaceController extends HapiController implements IRaceController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.RaceService) private service: RaceService,
    @inject(TYPES.RaceResultService) private raceResultService: RaceResultService,
    @inject(TYPES.Mapper) private mapper: Mapper)
  {
    super()
    this.logger.info('Created controller RaceController')
  }

// #region addRace
/**
 * Add a new race (with its results) to the system
 */
  @HapiRoute({
    method: 'POST',
    path: 'races',
    options: {
      validate: {
        payload: {
          name: Joi.string().required(),
          results: Joi.array().items(
            Joi.object().keys({
              car: Joi.string().guid().required(),
              carNumber: Joi.string(),
              race: Joi.string().guid().required(),
              driver: Joi.string().guid().required(),
              class: Joi.string().guid().required(),
              startingPosition: Joi.number().required(),
              finishingPosition: Joi.number(),
              isFinished: Joi.boolean()
            })
          )
        }
      },
      description: 'Add a new race (with its results) to the system',
      tags: ['race', 'race-result'],
      auth: false
    }
  })
  public async addRace(request: Request, toolkit: ResponseToolkit) {
    const payload: Race = this.mapper.map(RaceModel, Race, request.payload)
    console.log('payload', payload)
    const item = await this.service.save(payload)
    return toolkit.response({id: item!.id}).code(201)
  }
// #endregion

// #region findRaces
/**
 * Finds all the races
 */
  @HapiRoute({
    method: 'GET',
    path: 'races',
    options: {
      validate: { },
      description: 'Finds Races',
      tags: ['race'],
      auth: false
    }
  })
  public async findRaces(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.service.findAll())
  }
// #endregion

// #region getRaceById
/**
 * Returns a single race
 */
  @HapiRoute({
    method: 'GET',
    path: 'races/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        }
      },
      description: 'Find race by ID',
      tags: ['race'],
      auth: false
    }
  })
  public async getRaceById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.service.findById(request.params.id)
    if (!item) {
      throw Boom.notFound()
    }
    return toolkit.response(item)
  }
// #endregion

// #region updateRace
/**
 * Updates an existing race by ID
 */
  @HapiRoute({
    method: 'PATCH',
    path: 'races/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        },
        payload: {
          name: Joi.string().required()
        }
      },
      description: 'Updates an existing race by ID',
      tags: ['race'],
      auth: false
    }
  })
  public async updateRace(request: Request, toolkit: ResponseToolkit) {
    const payload: Race = this.mapper.map(RaceModel, Race, Object.assign({}, request.payload, request.params))

    const item = await this.service.findById(payload.id)
    if (!item) {
      throw Boom.notFound()
    }
    console.log('payload', payload)
    await this.service.save(payload)
    return toolkit.response().code(204)
  }
// #endregion

// #region deleteRace
/**
 * Deletes a race by ID
 */
  @HapiRoute({
    method: 'DELETE',
    path: 'races/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        }
      },
      description: 'Deletes a race by ID',
      tags: ['race'],
      auth: false
    }
  })
  public async deleteRace(request: Request, toolkit: ResponseToolkit) {
    const result = await this.service.delete(request.params.id)
    if (!result.affected) {
      throw Boom.notFound()
    }
    return toolkit.response().code(204)
  }
// #endregion

// #region getRaceResults
/**
 * Get a race's results
 */
  @HapiRoute({
    method: 'GET',
    path: 'races/{id}/results',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        },
        query: {
          car: Joi.string().guid().description('of a specific car'),
          driver: Joi.string().guid().description('of a specific driver')
        }
      },
      description: 'Get a race\'s results',
      tags: ['race', 'race-result'],
      auth: false
    }
  })
  public async getRaceResults(request: Request, toolkit: ResponseToolkit) {
    const filterObject: any = {}
    request.query.car && (filterObject.car = request.query.car)
    request.query.driver && (filterObject.driver = request.query.driver)
    const item = await this.service.getResults(request.params.id, filterObject || null)
    if (!item) {
      throw Boom.notFound()
    }
    return toolkit.response(item)
  }
// #endregion

// #region addRaceResult
/**
 * Add new race results for an existing race
 */
  @HapiRoute({
    method: 'PUT',
    path: 'races/{id}/results',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        },
        payload: {
          results: Joi.array().items(
            Joi.object().keys({
              car: Joi.string().guid().required(),
              carNumber: Joi.string(),
              race: Joi.string().guid().required(),
              driver: Joi.string().guid().required(),
              class: Joi.string().guid().required(),
              startingPosition: Joi.number().required(),
              finishingPosition: Joi.number(),
              isFinished: Joi.boolean()
            })
          )
        }
      },
      description: 'Add new race results for an existing race',
      tags: ['race', 'race-result'],
      auth: false
    }
  })
  public async addRaceResult(request: Request, toolkit: ResponseToolkit) {
    const payload: Race = this.mapper.map(RaceModel, Race, request.payload)
    console.log('payload', payload)
    const item = await this.service.save(payload)
    return toolkit.response({id: item!.id}).code(201)
  }
// #endregion

// #region updateRaceResult
/**
 * Updates an existing race result
 */
  @HapiRoute({
    method: 'PATCH',
    path: 'races/{id}/results/{raceResultId}',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required(),
          raceResultId: Joi.string().guid().required()
        },
        payload: {
          car: Joi.string().guid(),
          carNumber: Joi.string(),
          race: Joi.string().guid(),
          driver: Joi.string().guid(),
          class: Joi.string().guid(),
          startingPosition: Joi.number(),
          finishingPosition: Joi.number(),
          isFinished: Joi.boolean()
        }
      },
      description: 'Updates an existing race result',
      tags: ['race', 'race-result'],
      auth: false
    }
  })
  public async updateRaceResult(request: Request, toolkit: ResponseToolkit) {
    const payload: RaceResult = this.mapper.map(RaceResultModel, RaceResult, Object.assign({}, request.payload, request.params))

    const item = await this.raceResultService.findById(payload.id)
    if (!item) {
      throw Boom.notFound()
    }
    console.log('payload', payload)
    await this.raceResultService.save(payload)
    return toolkit.response().code(204)
  }
// #endregion

}

export { RaceController }
