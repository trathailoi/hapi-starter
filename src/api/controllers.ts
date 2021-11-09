import { ServerRoute } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc/types";
import { HapiController } from "./hapicontroller";
import { HelloWorldController } from "./helloworld/controller";

@injectable()
class Controllers {
    @inject(TYPES.HelloWorldController) 
    public helloWorldController?: HelloWorldController;

    /**
     * Wraps the static getRoutes() method on HapiController.  This makes more sense
     * semantically to ask for routes for all controllers on this class as opposed
     * to a random base class not used anywhere else in the application.
     */
    public getRoutes(): Array<ServerRoute> {
        return HapiController.getRoutes();
    }
}

export { Controllers }