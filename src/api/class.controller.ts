import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';
import { Mapper } from "../helpers/mapper";

import { ClassService } from '../service/class';
import { ClassModel } from '../dto/class';
import { Class } from '../entity/Class';

@injectable()
class ClassController extends HapiController {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.ClassService) private classService: ClassService,
    @inject(TYPES.Mapper) private mapper: Mapper
    ) {
    super();
    this.logger.info('Created controller ClassController');
  }

  /**
   * Add a new class to the system
   */
  @HapiRoute({
    method: 'POST',
    path: 'classes',
    options: {
      validate: {
        payload: {
          name: Joi.string().required()
        }
      },
      description: 'Add a new class to the system',
      tags: ['api', 'class'],
      auth: false
    }
  })
  public async addClass(request: Request, toolkit: ResponseToolkit) {
    const payload: Class = this.mapper.map(ClassModel, Class, request.payload);
    const _class = await this.classService.save(payload);
    return toolkit.response(_class);
  }

  /**
   * Finds Classes
   */
  @HapiRoute({
    method: 'GET',
    path: 'classes',
    options: {
      validate: {},
      description: 'Finds Classes',
      tags: ['api', 'class'],
      auth: false
    }
  })
  public async getClasses(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.classService.findAll());
  }

  /**
   * Find an class by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'classes/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().length(36).required()
        }
      },
      description: 'Find an class by ID',
      tags: ['api', 'class'],
      auth: false
    }
  })
  public async getClassById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.classService.findById(request.params.id);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(item);
  }

  /**
   * Updates an existing class by ID
   */
  @HapiRoute({
    method: 'PATCH',
    path: 'classes/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().length(36).required()
        },
        payload: {
          name: Joi.string().required()
        }
      },
      description: 'Updates an existing class by ID',
      tags: ['api', 'class'],
      auth: false
    }
  })
  public async updateClass(request: Request, toolkit: ResponseToolkit) {
    const payload: Class = this.mapper.map(ClassModel, Class, Object.assign({}, request.payload, request.params));

    const item = await this.classService.findById(payload.id);
    if (!item) {
      throw Boom.notFound();
    }
    const _class = await this.classService.save(payload);
    return toolkit.response(_class);
  }

  /**
   * Delete an class by ID
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'classes/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().length(36).required()
        }
      },
      description: 'Delete an class by ID',
      tags: ['api', 'class'],
      auth: false
    }
  })
  public async deleteClass(request: Request, toolkit: ResponseToolkit) {
    const result = await this.classService.delete(request.params.id);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response({
      statusCode: 200,
      message: 'Successful operation'
    });
  }

}

export { ClassController }
