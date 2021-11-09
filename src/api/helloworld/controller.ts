import { Request, ResponseToolkit } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../../ioc/types";
import { Logger } from "../../helpers/logger";
import { Route, RouteController } from "../../decorators/decorators";
import { HapiController } from "../base/hapicontroller";

@RouteController
@injectable()
class HelloWorldController extends HapiController {

    constructor(@inject(TYPES.Logger) private logger: Logger) { 
        super();
    }

    @Route({
        method: 'GET',
        path: '/api/helloworld',
        options: {
            description: 'Hello World!',
            tags: ['api', 'test'],
            auth: false,
        }
    })
    public getAll(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('getAll invoked');
        return 'Hello World!';
    }

    @Route({
        method: 'GET',
        path: '/api/helloworld/{id}',
        options: {
            description: 'Not implemented',
            tags: ['api', 'test'],
            auth: false,
        }
    })
    public getById(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('getById invoked');
        return toolkit.response().code(501);
    }
}

export { HelloWorldController }