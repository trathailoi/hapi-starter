import { Request, ResponseToolkit, Server, ResponseValue } from "@hapi/hapi";
import HelloWorldController from "./api/helloworld/controller";

let server: Server;

(async () => {
    server = new Server({
        port: 8080
    });

    const testController = new HelloWorldController();

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
