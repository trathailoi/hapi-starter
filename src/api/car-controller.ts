import { Request, ResponseToolkit } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc/types";
import { Logger } from "winston";
import { HapiRoute } from "../decorators/decorators";
import { HapiController } from "./hapi-controller";
import { CarService } from "../service/carservice";
import * as Joi from '@hapi/joi';
import * as Boom from "@hapi/boom";
import { Car } from "src/entity/car";

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
            //try {
                this.logger.info('Cars getAll invoked');
                this.logger.info('Beginning async');
                const cars = await this.carService.findAll();
                //await testAsync();
                this.logger.info('Ended async');
                return [];
            /*} catch (e) {
                debugger;
                this.logger.error(JSON.stringify(e));
                throw (e);
            }*/
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

async function testAsync() {
    return new Promise((resolve, reject) => setTimeout(() => resolve(true), 500));
}

export { CarController }