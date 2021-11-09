import { Request, ResponseToolkit, Server, ResponseValue } from "@hapi/hapi";
import { HelloWorldController } from "./api/helloworld/controller";
import { container } from "./ioc/ioc";
import { TYPES } from "./ioc/types";
import { Reflector } from './decorators/reflector';

let server: Server;

(async () => {
    server = new Server({
        port: 8080
    });

    const testController = container.get<HelloWorldController>(TYPES.HelloWorldController);

    const reflector: Reflector = new Reflector([
        testController,
        new String()
    ]);
    const controllers = reflector.getClassesAnnotatedWith('RouteController');
    const annotations = reflector.getAnnotationsForClassName('HelloWorldController');
    debugger;

    server.route([
        {
            method: 'GET',
            path: '/api/helloworld',
            options: {
                handler: testController.getAll.bind(testController),
                description: 'Hello World!',
                tags: ['api', 'test'],
                auth: false,
            }
        },
        {
            method: 'GET',
            path: '/api/helloworld/{id}',
            options: {
                handler: testController.getById.bind(testController),
                description: 'Not implemented',
                tags: ['api', 'test'],
                auth: false,
            }
        },
        
    ]);

    await server.start()
})();
