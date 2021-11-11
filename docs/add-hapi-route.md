# How Do I Add a HAPI Route Handler?

Adding a new route handler is pretty easy once you have the controller in place.  This how-to assumes that you do already have a controller.  For example, you already have a CarController with a method to get all cars and now you want to add a route that lets API consumers query for a specifc car (or add a new car).  If you need to create a new controller from scratch, follow [this tutorial](add-controller.md).

There are two steps to adding a new HAPI route.  First, open your controller file and add a method for your route handler code.  Most likely if you're starting from an existing controller you'll already have the service, for example.  If you do need additional dependencies, you can add them to the constructor and Inversify will provide them for you - assuming they're already set up with Inversify.  If you need to register a new dependency with inversify, check the ("Add Controller" tutorial)[add-controller.md] or the ("Add Service" tutorial)[add-service.md] for those instructions.

Once you've set up your dependencies and written the code to handle the route, the next step is to register the route with HAPI.  We can do that easily by adding an @HapiRoute annotation.  The annotation takes the same data as you would pass to HAPI if you were registering the route manually.  Instead of writing code like this:

```
import { Server } from '@hapi/hapi';

const hapiServer = new Server( {port: 8080} );
this.hapiServer.route({
        method: 'GET',
        path: 'cars/{id}',
        options: {
            validate: {
                params: {
                  id: Joi.number().integer().required(),
                }
            },
            description: 'Not implemented',
            tags: ['api', 'test'],
            auth: false,
        }
    });
```

...you pass the same data in your controller annotation:

```
@HapiRoute({
    method: 'GET',
    path: 'cars/{id}',
    options: {
        validate: {
            params: {
                id: Joi.number().integer().required(),
            }
        },
        description: 'Not implemented',
        tags: ['api', 'test'],
        auth: false,
    }
})
public getById(request: Request, toolkit: ResponseToolkit) {
    // Code to implement the getById route
}
```