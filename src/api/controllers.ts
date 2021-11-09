import { ServerRoute } from "@hapi/hapi";
import { inject, injectable } from "inversify";
import { TYPES } from "../ioc/types";
import { CarController } from "./car-controller";
import { HapiController } from "./hapi-controller";
import { HelloWorldController } from "./helloworld-controller";

@injectable()
class Controllers {

    @inject(TYPES.HelloWorldController) 
    private helloWorldController?: HelloWorldController;

    @inject(TYPES.CarController)
    private carController?: CarController;

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