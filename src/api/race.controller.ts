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
// import { RaceModel } from '../dto/race'
// import { Race } from '../entity/race'

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
      validate: { },
      description: 'Add a new race (with its results) to the system',
      tags: ['race','race-result',],
      auth: false
    }
  })
  public async addRace(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
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
      tags: ['race',],
      auth: false
    }
  })
  public async findRaces(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
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
      validate: { },
      description: 'Find race by ID',
      tags: ['race',],
      auth: false
    }
  })
  public async getRaceById(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
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
      validate: { },
      description: 'Updates an existing race by ID',
      tags: ['race',],
      auth: false
    }
  })
  public async updateRace(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
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
      validate: { },
      description: 'Deletes a race by ID',
      tags: ['race',],
      auth: false
    }
  })
  public async deleteRace(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
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
      validate: { },
      description: 'Get a race\'s results',
      tags: ['race','race-result',],
      auth: false
    }
  })
  public async getRaceResults(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
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
      validate: { },
      description: 'Add new race results for an existing race',
      tags: ['race','race-result',],
      auth: false
    }
  })
  public async addRaceResult(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
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
      validate: { },
      description: 'Updates an existing race result',
      tags: ['race','race-result',],
      auth: false
    }
  })
  public async updateRaceResult(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response().code(501)
  }
// #endregion

}

export { RaceController }
