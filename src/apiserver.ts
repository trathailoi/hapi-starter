import { Server, ServerRegisterPluginObject } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { Controllers } from "./api/controllers";
import { Logger } from "winston";
import { plugins } from "./helpers/plugins";
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
        Promise.all(plugins.map((p: any) => this.hapiServer.register(p)))
            .then(() => {
                this.hapiServer.start();
                this.logger.info('Server started.');
            });
    }

    private registerPlugin(descriptor: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.hapiServer.register(descriptor).then(() => resolve(true));
        }) 
    }
}

export { ApiServer }