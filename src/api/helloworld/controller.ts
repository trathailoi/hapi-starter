import { Request, ResponseToolkit } from "@hapi/hapi";

export default class HelloWorldController {

    public getAll(request: Request, toolkit: ResponseToolkit) {
        return 'Hello World!';
    }

    public getById(request: Request, toolkit: ResponseToolkit) {
        return toolkit.response().code(501);
    }
}