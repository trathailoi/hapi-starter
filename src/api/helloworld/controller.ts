import { Request, ResponseToolkit } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../../ioc/types";
import { Logger } from "../../helpers/logger";
import { RouteController } from "../../decorators/decorators";

@RouteController
@injectable()
class HelloWorldController {
    constructor(
        @inject(TYPES.Logger) private logger: Logger
    ) { }

    public getAll(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('getAll invoked');
        return 'Hello World!';
    }

    public getById(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('getById invoked');
        return toolkit.response().code(501);
    }
}

export { HelloWorldController }