import { Request, ResponseToolkit } from "@hapi/hapi";
import Logger from "../../helpers/logger";

export default class HelloWorldController {
    private logger: Logger = new Logger();

    public getAll(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('getAll invoked');
        return 'Hello World!';
    }

    public getById(request: Request, toolkit: ResponseToolkit) {
        this.logger.info('getById invoked');
        return toolkit.response().code(501);
    }
}