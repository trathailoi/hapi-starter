import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';

import { TeamService } from '../service/team';
import { TeamDTO } from '../dto/team';

@injectable()
class TeamController extends HapiController {

  constructor(
      @inject(TYPES.Logger) private logger: Logger,
      @inject(TYPES.TeamService) private teamService: TeamService)
  {
      super();
      this.logger.info('Created controller TeamController');
  }

/**
 * Get all team
 */
  @HapiRoute({
    method: 'GET',
    path: 'teams',
    options: {
      validate: { },
      description: 'Get all team',
      tags: ['Team'],
      auth: false
    }
  })
  public async getTeams(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.teamService.findAll());
  }

/**
 * Update an existing team
 */
  @HapiRoute({
    method: 'PUT',
    path: 'teams',
    options: {
      validate: {
        payload: {
          id: Joi.string().length(36).required(),
          name: Joi.string().required(),
          nationality: Joi.string().required().valid('USA', 'Viet Nam'),
          businessAddress: Joi.string().length(36).allow(null)
        }
      },
      description: 'Update an existing team',
      tags: ['Team'],
      auth: false
    }
  })
  public async updateTeam(request: Request, toolkit: ResponseToolkit) {
    const payload: TeamDTO = request.payload as TeamDTO;
    const item = await this.teamService.findById(payload.id);
    if (!item) {
      throw Boom.notFound();
    }
    await this.teamService.save(payload);
    return toolkit.response('success');
  }

/**
 * Add a new team to the store
 */
  @HapiRoute({
    method: 'POST',
    path: 'teams',
    options: {
      validate: {
        payload: {
          name: Joi.string().required(),
          nationality: Joi.string().required().valid('USA', 'Viet Nam'),
          businessAddress: Joi.string().length(36).allow(null)
        }
      },
      description: 'Add a new team to the store',
      tags: ['Team'],
      auth: false
    }
  })
  public async addTeam(request: Request, toolkit: ResponseToolkit) {
    const payload: TeamDTO = request.payload as TeamDTO;
    await this.teamService.save(payload);
    return toolkit.response('success');
  }

/**
 * Find team by ID
 */
  @HapiRoute({
    method: 'GET',
    path: 'teams/{teamId}',
    options: {
      validate: {
        params: {
          teamId: Joi.string().length(36).required()
        }
      },
      description: 'Find team by ID',
      tags: ['Team'],
      auth: false
    }
  })
  public async getTeamById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.teamService.findById(request.params.teamId);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(item);
  }

/**
 * Delete a team
 */
  @HapiRoute({
    method: 'DELETE',
    path: 'teams/{teamId}',
    options: {
      validate: {
        params: {
          teamId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a team',
      tags: ['Team'],
      auth: false
    }
  })
  public async deleteTeam(request: Request, toolkit: ResponseToolkit) {
    const result = await this.teamService.delete(request.params.teamId);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response('success');
  }

}

export { TeamController }
