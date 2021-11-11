import { Request, ResponseToolkit } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc/types";
import { Logger } from "winston";
import { HapiRoute } from "../decorators/decorators";
import { HapiController } from "./hapi-controller";
import { CarService } from "../service/carservice";
import * as Joi from '@hapi/joi';
import * as Boom from "@hapi/boom";
import { CarModel } from "../model/car";
import { Mapper } from "../helpers/mapper";
import { Car } from "../entity/car";


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
        @inject(TYPES.Mapper) private mapper: Mapper,
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
    public async getAllCars(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('Cars getAll invoked');

        //Retrieve all cars as entities
        const cars = await this.carService.findAll();
        const models = cars.map(c => this.mapper.map(Car, CarModel, c));
        return models;
    }

    /**
     * Adds a new car to the database.
     */
     @HapiRoute({
        method: 'POST',
        path: 'cars',
        options: {
            description: 'Adds a car',
            tags: ['api', 'cars'],
            auth: false,
        }
    })
    public async addCar(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('Cars addCar invoked');

        //Convert the incoming model to the corresponding entity
        const payload: CarModel = request.payload as CarModel;
        const entity = this.mapper.map(CarModel, Car, payload);

        //Save the entity
        const result = await this.carService.save(entity);

        //Return the result
        return this.mapper.map(Car, CarModel, result);
    }

    /**
     * Retrieves all cars of a specified make.
     */
    @HapiRoute({
        method: 'GET',
        path: 'cars/make/{make}',
        options: {
            validate: {
                params: {
                    make: Joi.string().required(),
                }
            },
            description: 'Get a car',
            tags: ['api', 'cars'],
            auth: false,
        }
    })
    public async getCarsByMake(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('Cars getCarsByMake invoked');
        const result = await this.carService.findByMake(request.params.make);
        return this.mapper.map(Car, CarModel, result);
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
            description: 'Get a car',
            tags: ['api', 'cars'],
            auth: false,
        }
    })
    public async getCarById(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('Cars getCarById invoked');
        const result = await this.carService.findById(request.params.id);
        return this.mapper.map(Car, CarModel, result);
    }

    /**
     * Updates a car
     */
    @HapiRoute({
        method: 'PUT',
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
    public async updateCar(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('Cars updateCar invoked');

        const car = this.mapper.map(CarModel, Car, request.payload as CarModel);
        const result = await this.carService.save(car);
        return result;
    }

    /**
     * Retrieves a single car by ID.  The ID parameter is validated by Joi to be an integer.
     */
     @HapiRoute({
        method: 'DELETE',
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
    public async deleteCar(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('Cars delete car invoked');
        const result = await this.carService.delete(request.params.id);
        if (result.affected === 0) {
            return toolkit.response().code(404);
        } else {
            return toolkit.response().code(200);
        }
    }
}

export { CarController }