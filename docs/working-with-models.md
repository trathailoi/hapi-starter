# How do I work with models (data transfer objects or DTOs), and how do I convert between models and entities?

## What's a model/DTO?
Data transfer objects (or models) represent the structure of data at your API level.  Effectively, they are shared between your client and server tiers - if both sides are coded in TypeScript the classes can be literally shared between the two codebases.  In TypeScript, these classes serve to teach the TypeScript compiler how the data that comes into and goes out of your API is structured, so that the compiler can check your code for errors in handling that data.

## How are these different from entities?

Good question!  Models represent the data structure as it exists at the API level, while entities model data at the database level.  They are similar, but serve different purposes.  Sometimes the data needs to be structured differently for client applications as it is on the server.  In many cases, the model will be similar or the same.

## How do I create a model?

Creating these model classes is really easy.  They're just simple TypeScript classes with no annotations or special features, and they're not managed by Inversify.  Let's create one now for our car data:

```
class CarModel {
    public id?: number;
    public make?: string;
    public model?: string;
    public color?: string;
    public entryNumber?: number;
}

export { CarModel }
```

As you can see, there's nothing special about this class.  We don't need to decorate anything, and we don't need to take any steps to register it with Inversify.  In our controller code, if we need to create a new instance of CarModel we can simply use ```new CarModel()```.

## How do I convert between models and entities?

If we need to interact with the database while handling a HAPI route, we need to do that using an entity.  However, what we get from the request isn't an entity, it's a model.  So how do we convert from CarModel to the Car entity we wrote previously?

One way to do it is just brute force:  Create a new Car entity and copy all of the values from the CarModel instance in the request to new entity.  That's a lot of boring code to write, so fortunately there are mapper utilities designed just for this purpose.  The one we're using in this project is ```automapper-ts```.  Usually you'll create mappings in both directions so you can convert a model to its corresponding entity, and vice-versa - but not always.  Sometimes you have things stored in the database that aren't created or updated through the API, in which case you'll only need a map from entity to model.  Sometimes you have entities that aren't exposed through the API at all (or models that aren't saved in the database) and these classes won't need maps at all.

Unfortunately, while ```automapper-ts``` helps us to write less code in many complex cases, it still requires us to tell it how to map each property in a class from source to destination.  That's almost as much code as the brute force approach - but we've simplified that in our framework.  If your model and entity share the same structure, there's are two utility methods that can configure ```automapper-ts``` for you.  These are ```createDefaultMap()``` and ```createDefaultBiDiMap()```, found in helpers/mapper.ts.  ```createDefaultMap()``` creates a one-way map, for example car model to car entity.  ```createDefaultBiDiMap()``` creates maps in both directions.  

Our car use case does have a model and entity that share the same structure, so we can set up the mapper by invoking ```createDefaultBiDiMap()```.  We add the code to create the maps in the constructor of the mapper class like this:

```
    constructor() {
        this.createDefaultBiDiMap(
            CarModel, 
            Car, 
            ['id', 'make', 'model', 'color', 'entryNumber']
        );
    }
```

Note that we have to pass in the list of fields we want mapped.  If we need to do something more complex - for example if one of the properties is an object or an array, the utility methods will return the maps automapper maps for further configuration.  See the [automapper-ts documentation](https://github.com/loedeman/AutoMapper) for more information about configuring the mapper.

When we want to convert from one type to another, we simply inject an instance of Mapper into our class and call the map method:

```
const instance: CarModel  = new CarModel();
//Set property values on our model here
const carEntity: Car = this.mapper.map(CarModel, Car, instance);
```
