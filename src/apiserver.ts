import { Server, ServerRegisterPluginObject } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { Controllers } from "./api/controllers";
import { Logger } from "winston";
import { plugins } from "./helpers/plugins";
import { TYPES } from "./ioc/types";
import { CarService } from "./service/carservice";
import { container } from "./ioc/ioc";

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

        //THis is a test
        /*
        const carService: CarService = container.get<CarService>(TYPES.CarService);
        this.logger.debug('Testing cars');
        carService.findAll().then(value => {
            this.logger.debug('Retrieved cars');
            console.log(JSON.stringify(value));
        });
        */
    }

    private registerPlugin(descriptor: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.hapiServer.register(descriptor).then(() => resolve(true));
        }) 
    }
}

export { ApiServer }