# Connecting Controllers and Services

To complete our tutorial, let's create a controller so we can expose a REST API for cars.  We're going to implement the API described in the cars-api.yaml file in the swagger folder.  You can generate developer-friendly documentation for this file by pasting its contents into the online swagger editor at [https://editor.swagger.io](https://editor.swagger.io).  The Swagger document describes an API that matches up to the service methods we created in the [How do I work with entities and services (database objects)](working-with-entities-services.md) documentation.

First, follow the steps in the [How do I add a new controller](add-controller.md) tutorial to create a new controller class for our CarController.  Our empty controller file will look like this:

```
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
     * in addition to the logger and mapper.  You can inject as many dependencies as you need.
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
        return toolkit.response.code(501);
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
        return toolkit.response.code(501);
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
        return toolkit.response.code(501);
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
        return toolkit.response.code(501);

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
        return toolkit.response.code(501);
    }
}

export { CarController }
```

We can build and run the application at this point.  If we hit the API endpoints using Postman, we'll receive 501 Not Implemented responses from the API but shouldn't see any runtime errors.  Now we effectively have to glue the controller route handlers together with the CarService methods that handle the database operations that each route represents.  In order to do that, we also have to map between the API-layer data model (our models or data transfer objects) and the database-layer data model (our entities) using the mapper.

Let's look at one of the easier routes first:  Implementing the getAllCars() handler.  This route is a little easier because we don't have to handle any input parameters and we only have to map the data model in one direction (entity to model).  Retrieving the list of cars from the database is now easy with our service - we invoke ```findAll()``` on the car service.  Mapping is equally easy - we inject an instance of the mapper into our controller and call the map function to map the results.  There's a slight twist here in that the map method only works on one instance at a time, so we wrap it in Array.map().

The completed method looks like this:

```
    public async getAllCars(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('Cars getAll invoked');

        //Retrieve all cars as entities
        const cars = await this.carService.findAll();
        const models = cars.map(c => this.mapper.map(Car, CarModel, c));
        return models;
    }
```

If you test this route using Postman, you'll get an empty JSON array as a response.  We haven't added any cars to the database yet!  Let's add fill out the ```addCar()``` method now to do that.  It's not too different from the method we just wrote, however in this method we are receiving a car model as the POST payload so we will need to convert that to a car entity before we can save it.  We use the mapper to help with that.

The completed method looks like this:

```
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
```

If you're not familiar with TypeScript, one thing to point out is the line where we retrieve the incoming data from the request:

```const payload: CarModel = request.payload as CarModel;```

Note the "as" keyword - this is called a type cast and is a way of telling the compiler that an object of a given type should be treated as a different type.  Here, we're telling the compiler that ```request.payload``` which is technically of the type ```any``` (equivalent to ```object``` in plain Javascript) is actually going to be a ```CarModel```.  That allows the TypeScript compiler to check to be sure that we're handling it properly in our code.

Now, we can re-run our tests.  Using Postman, we can POST JSON data to our new endpoint and then run the ```getAllCars()``` method again to make sure the data got saved correctly.  Pay attention to the "id" property.  When we send data to the service to be created, we won't yet have an id value in the object - we send that value as undefined (or omit it completely).  That tells TypeORM that this is a new object, not an update to an existing object.  When you look at the JSON returned by the ```addCar()``` endpoint, you'll notice that it has had its id property set by the database.  You'll use this id value to query for that specific car, update it, or delete it.

Implementing the rest of the methods in the controller are straightforward, so I won't cover them individually.  The fully completed controller code looks like this:

```
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
     * in addition to the logger and mapper.  You can inject as many dependencies as you need.
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
```

> A Postman API collection is included in the testscripts directory.  It contains Postman requests for all of the car API operations that you can use to test with.