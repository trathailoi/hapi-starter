import { Request, ResponseToolkit } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc/types";
import { Logger } from "winston";
import { HapiRoute } from "../decorators/decorators";
import { HapiController } from "./hapi-controller";
import { CarService } from "../service/carservice";
import * as Joi from '@hapi/joi';
import * as Boom from "@hapi/boom";

@injectable()
class CarController extends HapiController {

    constructor(
        @inject(TYPES.Logger) private logger: Logger,
        @inject(TYPES.CarService) private carService: CarService) 
    { 
        super();
        this.logger.info('Created controller CarController');
    }

    @HapiRoute({
        method: 'GET',
        path: 'cars',
        options: {
            description: 'Retrieves a list of all cars',
            tags: ['api', 'cars'],
            auth: false,
        }
    })
    public async getAll(request: Request, toolkit: ResponseToolkit) {
        debugger;
        try {
            this.logger.info('Cars getAll invoked');
            const cars = await this.carService.find();
            toolkit.response(cars);
        } catch (e) {
            this.logger.error(JSON.stringify(e))
        }
    }

    @HapiRoute({
        method: 'GET',
        path: 'cars/{id}',
        options: {
            validate: {
                params: {
                  id: Joi.number().integer().required(),
                }
            },
            description: 'Not implemented',
            tags: ['api', 'test'],
            auth: false,
        }
    })
    public getById(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('Cars getById invoked');
        throw Boom.notImplemented();
    }
}

export { CarController }