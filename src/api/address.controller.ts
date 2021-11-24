import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';
import { Mapper } from "../helpers/mapper";

import { AddressService } from '../service/address';
import { AddressModel } from '../dto/address';
import { Address } from '../entity/address';

@injectable()
class AddressController extends HapiController {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.AddressService) private addressService: AddressService,
    @inject(TYPES.Mapper) private mapper: Mapper
    ) {
    super();
    this.logger.info('Created controller AddressController');
  }

  /**
   * Add a new address to the system
   */
  @HapiRoute({
    method: 'POST',
    path: 'addresses',
    options: {
      validate: {
        payload: {
          name: Joi.string().required(),
          street: Joi.string().allow(null, ''),
          street2: Joi.string().allow(null, ''),
          city: Joi.string().required(),
          state: Joi.string().required(),
          zip: Joi.string().required(),
          country: Joi.string().required()
        }
      },
      description: 'Add a new address to the system',
      tags: ['api', 'address'],
      auth: false
    }
  })
  public async addAddress(request: Request, toolkit: ResponseToolkit) {
    const payload: Address = this.mapper.map(AddressModel, Address, request.payload);
    const address = await this.addressService.save(payload);
    return toolkit.response(address);
  }

  /**
   * Finds Addresses
   */
  @HapiRoute({
    method: 'GET',
    path: 'addresses',
    options: {
      validate: {},
      description: 'Finds Addresses',
      tags: ['api', 'address'],
      auth: false
    }
  })
  public async getAddresses(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.addressService.findAll());
  }

  /**
   * Find an address by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'addresses/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().length(36).required()
        }
      },
      description: 'Find an address by ID',
      tags: ['api', 'address'],
      auth: false
    }
  })
  public async getAddressById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.addressService.findById(request.params.id);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(item);
  }

  /**
   * Updates an existing address by ID
   */
  @HapiRoute({
    method: 'PATCH',
    path: 'addresses/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().length(36).required()
        },
        payload: {
          name: Joi.string(),
          street: Joi.string().allow(null, ''),
          street2: Joi.string().allow(null, ''),
          city: Joi.string(),
          state: Joi.string(),
          zip: Joi.string(),
          country: Joi.string()
        }
      },
      description: 'Updates an existing address by ID',
      tags: ['api', 'address'],
      auth: false
    }
  })
  public async updateAddress(request: Request, toolkit: ResponseToolkit) {
    const payload: Address = this.mapper.map(AddressModel, Address, Object.assign({}, request.payload, request.params));

    const item = await this.addressService.findById(payload.id);
    if (!item) {
      throw Boom.notFound();
    }
    const address = await this.addressService.save(payload);
    return toolkit.response(address);
  }

  /**
   * Delete an address by ID
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'addresses/{id}',
    options: {
      validate: {
        params: {
          id: Joi.string().length(36).required()
        }
      },
      // pre: [
      //   { method: async (request: Request, toolkit: ResponseToolkit) => {
      //     const item = await this.addressService.findById(request.params.id)
      //     if (!item) {
      //       return Boom.notFound();
      //     }
      //     return item
      //   }, assign: 'detail' }
      // ],
      description: 'Delete an address by ID',
      tags: ['api', 'address'],
      auth: false
    }
  })
  public async deleteAddress(request: Request, toolkit: ResponseToolkit) {
    const result = await this.addressService.delete(request.params.id);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response({
      statusCode: 200,
      message: 'Successful operation'
    });
  }

}

export { AddressController }
