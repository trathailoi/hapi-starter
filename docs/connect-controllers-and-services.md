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
        this.logger.info('Cars getAll invoked');
        const cars = await this.carService.findAll();
        return cars;
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
```