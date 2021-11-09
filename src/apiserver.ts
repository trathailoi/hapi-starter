import { Server } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { Controllers } from "./api/controllers";
import { Logger } from "./helpers/logger";
import { TYPES } from "./ioc/types";

@injectable()
class ApiServer {
    private hapiServer: Server;

    constructor(
        @inject(TYPES.Logger) private logger: Logger,
        @inject(TYPES.Controllers) controllers: Controllers
    ) {
        // Configure HAPI server
        this.hapiServer = new Server({
            port: 8080
        });
        this.hapiServer.validator(require('@hapi/joi'));
        this.hapiServer.route(controllers.getRoutes());
        this.hapiServer.start();
    }
}

export { ApiServer }