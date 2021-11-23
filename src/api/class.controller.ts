import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';

import { ClassService } from '../service/class';
import { ClassDTO } from '../dto/class';
import { Class } from '../entity/Class';
import { ClassMapper } from '../helpers/mapper/class';

@injectable()
class ClassController extends HapiController {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.ClassMapper) private classMapper: ClassMapper,
    @inject(TYPES.ClassService) private classService: ClassService) {
    super();
    this.logger.info('Created controller ClassController');
  }

  /**
   * Get all class
   */
  @HapiRoute({
    method: 'GET',
    path: 'classes',
    options: {
      validate: {},
      description: 'Get all class',
      tags: ['Class'],
      auth: false
    }
  })
  public async getClasses(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.classService.findAll());
  }

  /**
   * Update an existing class
   */
  @HapiRoute({
    method: 'PUT',
    path: 'classes/{classId}',
    options: {
      validate: {
        params: {
          classId: Joi.string().length(36).required()
        },
        payload: {
          name: Joi.string().required()
        }
      },
      description: 'Update an existing class',
      tags: ['Class'],
      auth: false
    }
  })
  public async updateClass(request: Request, toolkit: ResponseToolkit) {
    const item = await this.classService.findById(request.params.classId);
    if (!item) {
      throw Boom.notFound();
    }
    const payload: Class = this.classMapper.map(ClassDTO, Class, request.payload);
    payload.id = request.params.classId;
    await this.classService.save(payload);
    return toolkit.response('success');
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
      tags: ['Class'],
      auth: false
    }
  })
  public async addClass(request: Request, toolkit: ResponseToolkit) {
    const payload: Class = this.classMapper.map(ClassDTO, Class, request.payload);
    await this.classService.save(payload);
    return toolkit.response('success');
  }

  /**
   * Find class by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'classes/{classId}',
    options: {
      validate: {
        params: {
          classId: Joi.string().length(36).required()
        }
      },
      description: 'Find class by ID',
      tags: ['Class'],
      auth: false
    }
  })
  public async getClassById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.classService.findById(request.params.classId);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(item);
  }

  /**
   * Delete a class
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'classes/{classId}',
    options: {
      validate: {
        params: {
          classId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a class',
      tags: ['Class'],
      auth: false
    }
  })
  public async deleteClass(request: Request, toolkit: ResponseToolkit) {
    const result = await this.classService.delete(request.params.classId);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response('success');
  }

}

export { ClassController }
