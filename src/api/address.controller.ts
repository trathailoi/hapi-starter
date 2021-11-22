import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from '@hapi/joi';
import * as Boom from '@hapi/boom';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from '../ioc/types';
import { HapiRoute } from '../decorators/decorators';
import { HapiController } from './hapi-controller';

import { AddressService } from '../service/address';
import { AddressDTO } from '../dto/address';

@injectable()
class AddressController extends HapiController {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.AddressService) private addressService: AddressService) {
    super();
    this.logger.info('Created controller AddressController');
  }

  /**
   * Get all address
   */
  @HapiRoute({
    method: 'GET',
    path: 'addresses',
    options: {
      validate: {},
      description: 'Get all address',
      tags: ['Address'],
      auth: false
    }
  })
  public async getAddresses(request: Request, toolkit: ResponseToolkit) {
    return toolkit.response(await this.addressService.findAll());
  }

  /**
   * Update an existing address
   */
  @HapiRoute({
    method: 'PUT',
    path: 'addresses',
    options: {
      validate: {
        payload: {
          id: Joi.string().length(36).required(),
          street: Joi.string().allow(null, ''),
          street2: Joi.string().allow(null, ''),
          city: Joi.string().required(),
          state: Joi.string().required(),
          zipcode: Joi.string().required(),
          country: Joi.string().required()
        }
      },
      description: 'Update an existing address',
      tags: ['Address'],
      auth: false
    }
  })
  public async updateAddress(request: Request, toolkit: ResponseToolkit) {
    const payload: AddressDTO = request.payload as AddressDTO;
    const item = await this.addressService.findById(payload.id);
    if (!item) {
      throw Boom.notFound();
    }
    await this.addressService.save(payload);
    return toolkit.response('success');
  }

  /**
   * Add a new address to the store
   */
  @HapiRoute({
    method: 'POST',
    path: 'addresses',
    options: {
      validate: {
        payload: {
          street: Joi.string().allow(null, ''),
          street2: Joi.string().allow(null, ''),
          city: Joi.string().required(),
          state: Joi.string().required(),
          zipcode: Joi.string().required(),
          country: Joi.string().required()
        }
      },
      description: 'Add a new address to the store',
      tags: ['Address'],
      auth: false
    }
  })
  public async addAddress(request: Request, toolkit: ResponseToolkit) {
    const payload: AddressDTO = request.payload as AddressDTO;
    await this.addressService.save(payload);
    return toolkit.response('success');
  }

  /**
   * Find address by ID
   */
  @HapiRoute({
    method: 'GET',
    path: 'addresses/{addressId}',
    options: {
      validate: {
        params: {
          addressId: Joi.string().length(36).required()
        }
      },
      description: 'Find address by ID',
      tags: ['Address'],
      auth: false
    }
  })
  public async getAddressById(request: Request, toolkit: ResponseToolkit) {
    const item = await this.addressService.findById(request.params.addressId);
    if (!item) {
      throw Boom.notFound();
    }
    return toolkit.response(item);
  }

  /**
   * Delete a address
   */
  @HapiRoute({
    method: 'DELETE',
    path: 'addresses/{addressId}',
    options: {
      validate: {
        params: {
          addressId: Joi.string().length(36).required()
        }
      },
      description: 'Delete a address',
      tags: ['Address'],
      auth: false
    }
  })
  public async deleteAddress(request: Request, toolkit: ResponseToolkit) {
    const result = await this.addressService.delete(request.params.addressId);
    if (!result.affected) {
      throw Boom.notFound();
    }
    return toolkit.response('success');
  }

}

export { AddressController }