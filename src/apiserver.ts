import { Server } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { HapiController } from "./api/base/hapicontroller";
import { HelloWorldController } from "./api/helloworld/controller";
import { Logger } from "./helpers/logger";
import { TYPES } from "./ioc/types";

@injectable()
class ApiServer {
    private hapiServer: Server;

    constructor(
        @inject(TYPES.Logger) private logger: Logger,
        @inject(TYPES.HelloWorldController) helloWorldController: HelloWorldController
    ) {
        // Configure HAPI server
        this.hapiServer = new Server({
            port: 8080
        });

        const t = HapiController.getRoutes();
        debugger;
        this.hapiServer.route(HapiController.getRoutes());

        this.hapiServer.start();
    }
}

export { ApiServer }