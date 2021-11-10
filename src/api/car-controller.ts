import { Request, ResponseToolkit } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc/types";
import { Logger } from "winston";
import { HapiRoute } from "../decorators/decorators";
import { HapiController } from "./hapi-controller";
import { CarService } from "../service/carservice";
import * as Joi from '@hapi/joi';
import * as Boom from "@hapi/boom";


/**
 * This controller implements a more realistic set of API endpoints for managing cars.
 * Each method performs one task related to a car.  It should not directly deal with the 
 * request (that's HAPI's job) or the database (that's the serviece's job).
 */
@injectable()
class CarController extends HapiController {

    /**
     * Here we are also injecting the car service to manage interactions with the database
     * in addition to the logger.  You can inject as many dependencies as you need.
     */
    constructor(
        @inject(TYPES.Logger) private logger: Logger,
        @inject(TYPES.CarService) private carService: CarService) 
    { 
        super();
        this.logger.info('Created controller CarController');
    }

    /**
     * Returns all cars in the database.
     */
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
        this.logger.info('Cars getAll invoked');
        const cars = await this.carService.findAll();
        return cars;
    }

    /**
     * Retrieves a single car by ID.  The ID parameter is validated by Joi to be an integer.
     */
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