import { ServerRoute } from "@hapi/hapi";
import { injectable } from "inversify";

@injectable()
class HapiController {
    protected routes: Array<ServerRoute> = [];

    constructor() {
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