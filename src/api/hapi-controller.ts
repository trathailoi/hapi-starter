import { ServerRoute } from "@hapi/hapi";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
class HapiController {

    /*
        This static code is used to track all instances of HapiControllers so 
        we can generate a combined set of routes for the entire application.
    */ 
    private static controllers: Array<HapiController> = [];

    private static basePath = '/api/'
    public static getRoutes(): Array<ServerRoute> {
        let routes: Array<ServerRoute> = [];
        HapiController.controllers.forEach(
            c => routes = routes.concat(...c.routes.map(r => {
                r.path = this.basePath + r.path;
                return r;
            }))
        );
        return routes;
    }
    
    public routes: Array<ServerRoute> = [];

    constructor() {
        //Track the controller
        HapiController.controllers.push(this);

        //We need this due to some issues with "this" and decorators.
        const routes = (this as any).__proto__.routes;
        routes.forEach((r: any) => {
            if (r.handler) {
                r.handler = r.handler.bind(this);
                this.routes.push(r);
            }
        })
    }

}

export  { HapiController }