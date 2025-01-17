import { Request, ResponseToolkit } from '@hapi/hapi'
import { inject, injectable } from 'inversify'
import { TYPES } from '../ioc/types'
import { Logger } from 'winston'
import { HapiRoute } from '../decorators/decorators'
import { HapiController } from './hapi-controller'
import * as Joi from '@hapi/joi'
import * as Boom from '@hapi/boom'
import { Mapper } from '../helpers/mapper'
import { IRaceResultController } from './interfaces/race-result.interface'

import { RaceResultService } from '../service/race-result.service'
// import { RaceResultModel } from '../dto/race-result'
// import { RaceResult } from '../entity/race-result'

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
class RaceResultController extends HapiController implements IRaceResultController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.RaceResultService) private service: RaceResultService,
    @inject(TYPES.Mapper) private mapper: Mapper)
  {
    super()
    this.logger.info('Created controller RaceResultController')
  }

// #region getRaceResultById
/**
 * Get a result detail by ID
 */
  @HapiRoute({
    method: 'GET',
    path: 'race-results/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        }
      },
      description: 'Get a result detail by ID',
      tags: ['race-result',],
      auth: false
    }
  })
  public async getRaceResultById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.service.findById(request.params.id)
    if (!item) {
      throw Boom.notFound()
    }
    return toolkit.response(item)
  }
// #endregion

// #region deleteRaceResult
/**
 * Delete a race result by ID
 */
  @HapiRoute({
    method: 'DELETE',
    path: 'race-results/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        }
      },
      description: 'Delete a race result by ID',
      tags: ['race-result',],
      auth: false
    }
  })
  public async deleteRaceResult(request: Request, toolkit: ResponseToolkit) {
    try {
      const result = await this.service.delete(request.params.id)
      if (!result.affected) {
        return Boom.notFound()
      }
      return toolkit.response().code(204)
    } catch (error) {
      throw Boom.badRequest(error as any)
    }
  }
// #endregion

}

export { RaceResultController }
