# How Do I Add a Controller?

Adding a controller is a little bit more complicated than adding a route handler to an existing route.  When adding a new controller, we have to register it with Inversify and tell Inversify how to manage that class.  These steps are the same for controllers, services, or any new class you want to have managed by Inversify.

If you haven't already, read through the "What is dependency injection?  What is inversion of control (IoC)?" section in the [What is a DTO/controller/entity/service/etc and why do we use them?](what-is-this.md) documentation before continuing.

1. Create a new .ts file for your class.  You don't have to implement it yet, but it's helpful to at least define and export the class to take advantage of your IDE's intelligence as you complete the remaining steps.

```
import { inject, injectable } from "inversify";
import { HapiController } from './hapi-controller';

@injectable()
class MyNewController extends HapiController {
    constructor() {
        super();
     }
}

export { MyNewController }
```
There are a few items of interest in this code.  First, I've added the @injectable() annotation to my class.  This tells Inversify that this class can receive dependencies through dependency injection, and that it can itself be injected as a dependency into other classes. Second, I've defined MyNewController as a subclass of HapiController (```extends HapiController```).  HapiController is a base class for all controllers in the application that implements the logic for discovering and registering route handlers with Hapi.  By extending HapiController, we don't have to manually write code to register our route handlers with Hapi.

2. Create a symbol for your new class and add it to the TYPES list.  Open ioc/types.ts and add a symbol declaration:

```
/**
 * The types structure is just a list of symbols for use by Inversify.
 * Each class managed by Inversify will have an entry in this list.
 */
const TYPES = {
    Configue: Symbol.for('Configue'),
    Logger: Symbol.for('Logger'),
    ApiServer: Symbol.for('ApiServer'),
    Controllers: Symbol.for('Controllers'),
    HelloWorldController: Symbol.for('HelloWorldController'),
    CarController: Symbol.for('CarController'),
    CarRepository: Symbol.for('CarRepository'),
    CarService: Symbol.for('CarService'),
    MyNewController: Symbol.for('MyNewController) // <=== Add this code for your new controller
}

export { TYPES }
```

3. Now, we tell Inversify how to manage instances of MyNewController.  We only need one instance of MyNewController (or any route controller) for the entire application, so we will tell Inversify to manage this controller as a singleton.  Open the ioc/ioc.ts file and find the "controllers" section of the code.  Add the following code:

```
// Controllers
container.bind<HelloWorldController>(TYPES.HelloWorldController).to(HelloWorldController).inSingletonScope();
container.bind<CarController>(TYPES.CarController).to(CarController).inSingletonScope();
container.bind<MyNewController>(TYPES.MyNewController).to(MyNewController).inSingletonScope(); // <=== Add this line
```

4. We're almost done.  We've handled all the setup tasks that Inversify needs in order to manage the class.  The final step is to tell the framework that we have a new controller to include at start-up.  This is really easy - simply inject an instance of your new controller into the controllers class.  Open the file api/controllers.ts and add the following code:

```
@injectable()
class Controllers {

    @inject(TYPES.HelloWorldController) 
    private helloWorldController?: HelloWorldController;

    @inject(TYPES.CarController)
    private carController?: CarController;

    @inject(TYPES.MyNewController)                  // <== Add this code
    private myNewController?: MyNewController;      // <== Add this code

    ... 
```

You can test that the new controller is instantiated properly and that its dependencies are resolved by injecting the logger and writing out some log information in the constructor:
```
import { inject, injectable } from "inversify";
import { HapiController } from './hapi-controller';

@injectable()
class MyNewController extends HapiController {
    constructor(
        @inject(TYPES.Logger) private logger: Logger        // <=== Add this code
    ) {
        super();
        this.logger.info('Created MyNewController');        // <=== Add this code
     }
}

export { MyNewController }
```

Build and run the application, and you'll see logging information in the console that indicates your new controller has been created:

```
[nodemon] starting `./node_modules/.bin/ts-node ./src/index.ts`
2021-11-10 18:39:17 [info]:     Created controller HelloWorldController 
2021-11-10 18:39:17 [info]:     Created service CarService 
2021-11-10 18:39:17 [info]:     Created controller CarController 
2021-11-10 18:39:17 [info]:     Created controller MyNewController 
2021-11-10 18:39:17 [info]:     Server started. 
```

Now you can implement the API routes that you want this new controller to handle following the instructions in the [How do I add a new HAPI route?](add-hapi-route.md) documentation.