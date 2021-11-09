import { Server } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { HelloWorldController } from "./api/helloworld/controller";
import { Logger } from "./helpers/logger";
import { TYPES } from "./ioc/types";

@injectable()
class ApiServer {
    private controllers: Array<any>;
    private hapiServer: Server;

    constructor(
        @inject(TYPES.Logger) private logger: Logger,
        @inject(TYPES.HelloWorldController) helloWorldController: HelloWorldController
    ) {
        this.controllers = [
            helloWorldController
        ];

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
        this.hapiServer.route([
            {
                method: 'GET',
                path: '/api/helloworld',
                options: {
                    handler: helloWorldController.getAll.bind(helloWorldController),
                    description: 'Hello World!',
                    tags: ['api', 'test'],
                    auth: false,
                }
            },
            {
                method: 'GET',
                path: '/api/helloworld/{id}',
                options: {
                    handler: helloWorldController.getById.bind(helloWorldController),
                    description: 'Not implemented',
                    tags: ['api', 'test'],
                    auth: false,
                }
            },
            
        ]);

        this.hapiServer.start();
    }
}

export { ApiServer }