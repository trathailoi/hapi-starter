import { Lifecycle, Request, ResponseToolkit } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc/types";
import { Logger } from "winston";
import { HapiRoute } from "../decorators/decorators";
import { HapiController } from "./hapi-controller";
import { AddressService } from '../service/addressservice';
import { Address } from '../entity/Address';
import * as Joi from '@hapi/joi';
import * as Boom from "@hapi/boom";

@injectable()
class AddressController extends HapiController {
    constructor(@inject(TYPES.Logger) private logger: Logger, @inject(TYPES.AddressService) private addressService: AddressService) { 
        super();
        this.logger.info('Created controller AddressController');
    }

    @HapiRoute({
        method: 'GET',
        path: 'addresses',
        options: {
            description: 'Get all address',
            tags: ['api', 'test'],
            auth: false,
        }
    })
    public findAll(request: Request, toolkit: ResponseToolkit) {
        return this.addressService.findAll();
    }

    @HapiRoute({
        method: 'GET',
        path: 'addresses/{addressId}',
        options: {
            description: 'Get all address',
            tags: ['api', 'test'],
            auth: false,
        }
    })
    public findById(request: Request, toolkit: ResponseToolkit) {
        return this.addressService.findById(request.params.addressId);
    }

    @HapiRoute({
        method: 'POST',
        path: 'addresses',
        options: {
            description: 'Get all address',
            tags: ['api', 'test'],
            auth: false,
        }
    })
    public create(request: Request, toolkit: ResponseToolkit) {
        const payload:Object = request.payload;
        return this.addressService.save(payload);
    }

    @HapiRoute({
        method: 'PUT',
        path: 'addresses',
        options: {
            description: 'Get all address',
            tags: ['api', 'test'],
            auth: false,
        }
    })
    public update(request: Request, toolkit: ResponseToolkit) {
        const payload:Object = request.payload;
        return this.addressService.save(payload);
    }

    @HapiRoute({
        method: 'DELETE',
        path: 'addresses/{addressId}',
        options: {
            description: 'Get all address',
            tags: ['api', 'test'],
            auth: false,
        }
    })
    public delete(request: Request, toolkit: ResponseToolkit) {
        return this.addressService.delete(request.params.addressId);
    }
}

export { AddressController }