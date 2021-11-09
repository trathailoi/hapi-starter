import { Request, ResponseToolkit, Server, ResponseValue } from "@hapi/hapi";

let server: Server;

(async () => {
    server = new Server({
        port: 8080
    });

    server.route([
        {
            method: 'GET',
            path: '/api/helloworld',
            options: {
                handler: (request: Request, toolkit: ResponseToolkit) => 'Hello World!',
                description: 'Hello World!',
                tags: ['api', 'test'],
                auth: false,
            }
        }
    ]);

    await server.start()
})();
