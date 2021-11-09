import { Server } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { HelloWorldController } from "./api/helloworld/controller";
import { Logger } from "./helpers/logger";
import { container } from "./ioc/ioc";
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
        /*
        const testController = container.get<HelloWorldController>(TYPES.HelloWorldController);
    
        const reflector: Reflector = new Reflector([
            testController,
            new String()
        ]);
        const controllers = reflector.getClassesAnnotatedWith('RouteController');
        const annotations = reflector.getAnnotationsForClassName('HelloWorldController');
        debugger;
        */
        debugger;
        this.hapiServer.route((helloWorldController as any).routes);

        this.hapiServer.start();
    }
}

export { ApiServer }