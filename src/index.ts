import { Request, ResponseToolkit, Server, ResponseValue } from "@hapi/hapi";
import { HelloWorldController } from "./api/helloworld-controller";
import { container } from "./ioc/ioc";
import { TYPES } from "./ioc/types";
import { Reflector } from './decorators/reflector';
import { ApiServer } from "./apiserver";
import { initializeDatabase } from "./helpers/database";

let server: Server;

(async () => {
    await initializeDatabase();
    await container.get<ApiServer>(TYPES.ApiServer);
})();
