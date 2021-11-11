# How Do I Add a Service?

Before we begin, please review the "What's an entity, and how is that different from a DTO?" and "What's a service" sections of the [What is a DTO/controller/entity/service/etc and why do we use them?](what-is-this.md) documentation.

As a quick review:
- Entities represent data that we want to store in a database.  They define how the ORM layer (TypeORM) should represent these data structures in the database.  You can think of an entity as an abstraction for a table in a relational database.
- Repositories are classes implement the nuts and bolts of creating, updating, deleting, and querying data in the database.  Each entity will have a corresponding repository.
- Services implement the code for managing entities in the database.  Services are responsible for the usual CRUD (Create, Read, Update, Delete) operations, and can also implement more complex operations.  Services are generally one-to-one with entities and respositories - but not always.  You may have entities that are only used through relationships with other entities that don't need their own services, and you may have services that implement complex operations for multiple entities.

So, when we talk about adding a new service, we're generally really talking about creating an entity, a repository, and a service!  Let's walk through how we do that.

## Creating an Entity

Our first step is to create a new entity.  Let's create one that represents race cars (I watch a lot of motorsport!).  Each race car has a make, model, color, and a number so we'll create a class that tracks those items.  

### Create an Entity Class
We can start with just creating a plain Javascript object that has the properties we need.

```
class Car {
    public make: string;
    public model: string;
    public color: string;
    public entryNumber: number;
}
```

Next, we tell have to tell TypeORM that this class is an entity that represents a table in the database.  To do this, we add the ```@Entity``` annotation to the class:

```
@Entity()
class Car {
    public make: string;
    public model: string;
    public color: string;
    public entryNumber: number;
}
```

> ```@Entity()``` can take a variety of parameters that tell TypeORM how the table should be configured in the database.  If we don't supply them, it will use sensible defaults.  For most cases this will be OK.

### Configure Properties
Next, we need to tell TypeORM which properties on our entity we want saved in the database.  In our case, that's all of them - but this isn't always true.  We may want properties that we use in our API code that we don't need saved in the database - we call those transient properties.  We may also add methods to our Car class if we need to.

Similar to how we tell TypeORM that the class is an entity, we use annotations to tell TypeORM which properties should be saved in the database, and how the columns that those properties are tracked in should be configured.  It's imnportant to note that in Javascript (and TypeScript!), we have a relatively simple typing system.  We basically only have "string", "number", and "boolean" simple types.  Languages like Java have a much richer typing system.  Relational databases have their own typing system where a lot of attention is paid to the sizes of each column in order to manage disk space usage.  When we are defining how each column is stored, we should then pay attention to both the SQL column type and its size.

You can see which TypeORM column types are supported by PostgreSQL in the [TypeORM documentation](https://orkhan.gitbook.io/typeorm/docs/entities#column-types-for-postgres).

Let's start with our string properties.  Checking the documentation, we have a variety of choices for representing character or string data:  character varying, varchar, character, char, text, and citext.  Some of these are synonyms like "character varying" and "varchar", or "character" and "char".  You can check the PostgreSQL documentation for the differences between each type.  For our purposes though the decision comes down to "char" and "varchar" with the difference being that "char" always takes up the same amount of space no matter what value is stored, while "varchar" takes up only the space needed for the value.  In most cases varchar is the right choice, however if you have something like the abbreviation for a US state (which always takes two characters), then char is more efficient.

Now that we've decided on how we're going to store that data, we can add ```@Column``` annotations to tell TypeORM how to store our string values:

```
@Entity()
class Car {
    @Column('varchar')
    public make: string;

    @Column('varchar')
    public model: string;

    @Column('varchar')
    public color: string;

    public entryNumber: number;
}
```

As with ```@Entity()```, TypeORM will use default values for anything not supplied - but we should be more specific about how we define our columns.  For example, we know that the values for make and model are unlikely to exceed 40 characters, and the value for color is unlikely to exceed 10 characters.  By specifying lengths for these columns, we can help to both prevent bad data from getting into the database and help the database be more efficient.

One other important thing to consider is whether or not we should allow null values for each property.  If we know that we should never have a case where a property doesn't have a value, we can tell the database to enforce that constraint using the ```nullable``` parameter.  This again helps us to be sure we don't have bad data in the database.

We can specify those constraints (and many more) by passing an options object in the ```@Column``` annotations:

```
@Entity()
class Car {
    @Column('varchar', {
        nullable: false,
        length: 40
    })
    public make: string;

    @Column('varchar', {
        nullable: false,
        length: 40
    })
    public model: string;

    @Column('varchar', {
        nullable: false,
        length: 20
    }))
    public color: string;

    public entryNumber: number;
}
```

For our "entryNumber" property, we repeat the same analysis as for string values.  First we determine which column type is the best fit for what we're trying to represent in the database, and then we add an ```@Column()``` annotation to define the parameters for that column.  Similar to character data, PostgreSQL has a rich set of numeric types:  int, int2, int4, int8, smallint, integer, bigint, decimal, numeric, real, float, float4, float8, double precision, and money.  Typically, racing car numbers are integers between 1 and 3 digits long.  We can elminate decimal, numeric, real, float, float4, float8, double precision, and money because they all represent non-integers.  Our race car numbers are small, so "smallint" seems to be the best choice.

```
@Entity()
class Car {
    @Column('varchar', {
        nullable: false,
        length: 40
    })
    public make: string;

    @Column('varchar', {
        nullable: false,
        length: 40
    })
    public model: string;

    @Column('varchar', {
        nullable: false,
        length: 20
    }))
    public color: string;

    @Column('smallint', {
        nullable:false
    })
    public entryNumber: number;
}
```

> *A note on SQL data types*
>
> SQL is actually a standard language which is supported by multiple database platforms.  The standard defines a set of column types that must be supported by the database to be fully SQL compliant.  Each database will typically have a richer set of column types than those supported by the SQL standard.  TypeORM in many cases supports these non-standard types.
> One of the benefits of an ORM is that you don't tie your code to any specific database.  You could for example swap out PostgreSQL for MySQL or Oracle or any other relational database supported by TypeORM without changing your code *as long as you stick to the SQL standard data types*.  In the example above, "smallint" is a better choice than "int2" because "int2" is a PostgreSQL-specific type, while "smallint" is a SQL standard type and therefore portable.

### Primary and Foreign Keys
At this point, we have defined our entity and annotated all the columns.  We have one step remaining.  As the name suggests, relational databases excel at relating different kinds of data to each other.  Although there are many ways to build relationships in SQL databases, the best practice is through primary/foreign key relationships.  

A primary key is simply a field that uniquely identifies each row in a table.  It's best practice to have a numeric primary key on each table that is automatically populated by the database during an insert and is never changed (some databases forbid changing primary key values after they're set).  We use primary keys to retrieve or update a specific row in a table.

We also use primary keys when defining relationships, in combination with a foreign key.  A foreign key is a pointer to a primary key in another table.  Let's look at an example:

Each car will have a driver associated with it.  Rows in the car table might look like this:
<table>
    <tr>
        <th>id</th>
        <th>make</th>
        <th>model</th>
        <th>color</th>
        <th>entrynumber</th>
    </tr>
    <tr>
        <td>0</td>
        <td>Ferrari</td>
        <td>488 GT-LM</td>
        <td>Red</td>
        <td>57</td>
    </tr>
        <tr>
        <td>1</td>
        <td>Porsche</td>
        <td>911 RSR</td>
        <td>White</td>
        <td>912</td>
    </tr>

</table>

Rows in the driver table might look like this:

<table>
    <tr>
        <th>id</th>
        <th>firstname</th>
        <th>lastname</th>
        <th>country</th>
    </tr>
    <tr>
        <td>0</td>
        <td>Kevin</td>
        <td>Estre</td>
        <td>France</td>
    </tr>
    <tr>
        <td>1</td>
        <td>James</td>
        <td>Calado</td>
        <td>United Kingdom</td>
    </tr>
</table>

In the above examples, the "id" column is the primary key for each table.  If we want to associate each car with its driver, we can add a foreign key relationship to one of the entities to point back to the other.  In this case, we'll add a column to the car table to associate the driver to the car - the foreign key.  The value of the foreign key column is the primary key value of the related row in the target table.  Our car table now look like this:

<table>
    <tr>
        <th>id</th>
        <th>driver_id</th>
        <th>make</th>
        <th>model</th>
        <th>color</th>
        <th>entrynumber</th>
    </tr>
    <tr>
        <td>0</td>
        <td>1</td>
        <td>Ferrari</td>
        <td>488 GT-LM</td>
        <td>Red</td>
        <td>57</td>
    </tr>
        <tr>
        <td>1</td>
        <td>0</td>
        <td>Porsche</td>
        <td>911 RSR</td>
        <td>White</td>
        <td>912</td>
    </tr>

</table>

This represents that the driver of the #57 Ferrari is James Calado (driver table primary key = 0) and the driver of the #912 Porsche is Kevin Estre (driver table primary key = 1).

We'll talk more about creating relationships between entities later on.  For now, it's enough to understand how primary keys are used in the database.  TypeORM abstracts most of the primary and foreign key database details from the developer so we don't have to worry much about how they work in SQL.  We do, however have to define a primary key property in our entities.  In TypeORM, a primary key on each entity is a requirement, though TypeORM doesn't require the key field to be numeric or set by the database.  TypeORM provides several annotations to represent different kinds of primary keys.  We want our primary keys to be set automatically by the database, so we'll use ```@PrimaryGeneratedColumn()```:


```
@Entity()
class Car {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('varchar', {
        nullable: false,
        length: 40
    })
    public make: string;

    @Column('varchar', {
        nullable: false,
        length: 40
    })
    public model: string;

    @Column('varchar', {
        nullable: false,
        length: 20
    }))
    public color: string;

    @Column('smallint', {
        nullable:false
    })
    public entryNumber: number;
}
```

That's it!  Our entity is done!

## Create a repository

Each TypeORM entity will have a corresponding repository.  Remeber that the purpose of the repository is to handle the details of working with the database to store and retrieve the entities in the database.  TypeORM actually creates the repositories for us - we don't have to implement them ourselves.  We do have to figure out how to get the repositories we need when we write our services code.  If you're thinking that we want Inversify to provide them for us, you're right!

The steps for registering repositories with Inversify are similar to other kinds of managed classes:  We create a symbol for it in the TYPES list and tell Inversify how to manage it in ioc.ts.

types.ts:
```
const TYPES = {
    Configue: Symbol.for('Configue'),
    Logger: Symbol.for('Logger'),
    ApiServer: Symbol.for('ApiServer'),
    Controllers: Symbol.for('Controllers'),
    HelloWorldController: Symbol.for('HelloWorldController'),
    CarController: Symbol.for('CarController'),
    CarRepository: Symbol.for('CarRepository'),                 <== Symbol for our car repository
    CarService: Symbol.for('CarService')
}
```

ioc.ts:
```
...

container.bind<Repository<Car>>(TYPES.CarRepository).toDynamicValue(
  () => createRepository<Car>(Car)
).inSingletonScope()

...
```

This binding is a little different than the one we use for controllers and services.  We have a utility method in ioc.ts that knows how to create repositories for an entity based on the entity class.  We can then tell inversify that when it needs to instantiate a car repository, it can do so by executing ```createRepository<Car>(Car)```.  We also use ```.inSingletonScope``` because we only need one instance of each repository (which saves us the overhead of creating and destroying one every time we need to access cars in the database).

## Creating a service

Now that we have our entity written and have told Inversify how to manage its related repository, we can move on to coding our car service.  Generally we will want to be able to create cars in the database, read a specific car from the database, update the car's information, and delete the car from the databse.  These are often called "CRUD" operations - create, read, update, delete.  We'll also want to be able to retrieve multiple cars - for example we might want to find all the Ferraris, or all the red cars, or we might simply want a complete list of all cars in the database.  Each of these operations will become methods on our service.

### Create a service class and register with Inversify
Let's start by creating our service class.  We know that in order to work with cars in the database, we're going to need Inversify to give us a reference to a car repository, and we probably also want a logger.

services/carservice.ts:
```
@injectable()
class CarService {
    constructor(
        @inject(TYPES.Loger) private logger: Logger,
        @inject(TYPES.CarRepository) private carRepository: Repository<Car>
    ) {
        this.logger.info('Created CarService');
    }

}

export { CarService }
```

Next, we follow steps similar to controllers and repositories to register our service with Inversify.

types.ts:
```
const TYPES = {
    Configue: Symbol.for('Configue'),
    Logger: Symbol.for('Logger'),
    ApiServer: Symbol.for('ApiServer'),
    Controllers: Symbol.for('Controllers'),
    HelloWorldController: Symbol.for('HelloWorldController'),
    CarController: Symbol.for('CarController'),
    CarRepository: Symbol.for('CarRepository'),                 
    CarService: Symbol.for('CarService')                       <== Symbol for our car service
}
```

ioc.ts:
```
...

container.bind<CarService>(TYPES.CarService).to(CarService).inSingletonScope();

...
```

This is our simplest Inversify binding - there's no special steps to creating a CarService instance.

We can test that we have everything set up properly by running the application and checking the logging output:
```
[nodemon] starting `./node_modules/.bin/ts-node ./src/index.ts`
2021-11-10 18:39:17 [info]:     Created controller HelloWorldController 
2021-11-10 18:39:17 [info]:     Created service CarService 
2021-11-10 18:39:17 [info]:     Created controller CarController 
2021-11-10 18:39:17 [info]:     Server started. 
```

## Implement CRUD operations

Next will want to implement our basic create/read/update/delete operations (CRUD).  We'll write one method on our service for each of these operations.

carservice.ts:
```
import { injectable } from "inversify";
import { Logger } from "winston";
import { DeleteResult, Repository } from "typeorm";
import { Car } from '../entities/car'

@injectable()
class CarService {
    
    constructor(
        @inject(TYPES.CarRepository) repository: Repository<Car>,
        @inject(TYPES.Logger) logger: Logger
    ) { 
        this.logger.info('Created service CarService');
    }    

    public async findById(id: number): Promise<T | undefined> {
    }

    public async findAll(): Promise<Array<T>> {
    }

    public async save(entity: T): Promise<T | undefined> {
    }

    public async delete(id: number): Promise<DeleteResult> {
    }
}

export { CarService }
```

Two things to nore:  First, each of these methods are asynchronous.  This makes sense when you think about it - when you ask TypeORM to do something related to the database, the database needs an indeterminate amount of time to service that request (the same as invoking a REST service from Vue.js or working with MongoDB).  Second, we only have a "save" operation and not separate "create" and "update" operations.  TypeORM will simplify this for us, so we'll only need one method to handle both operations.

Next, we need to actually write the code to work with TypeORM to perform these operations.  As you might expect, TypeORM provides methods on the repository for these operations.  That makes them really easy to implement:

carservice.ts:
```
import { injectable } from "inversify";
import { Logger } from "winston";
import { DeleteResult, Repository } from "typeorm";
import { Car } from '../entities/car'

@injectable()
class CarService {
    
    constructor(
        @inject(TYPES.CarRepository) repository: Repository<Car>,
        @inject(TYPES.Logger) logger: Logger
    ) { 
        this.logger.info('Created service CarService');
    }    

    public async findById(id: number): Promise<T | undefined> {
        const result = await this.repository.findOne(id);
        return result;
    }

    public async findAll(): Promise<Array<T>> {
        const result = await this.repository.find();
        return result;
    }

    public async save(entity: T): Promise<T | undefined> {
        const result = this.repository.save(entity);
        return result;
    }

    public async delete(id: number): Promise<DeleteResult> {
        const result = this.repository.delete(id);
        return result;
    }
}

export { CarService }
```

### Testing Your New Service

Let's write a quick and dirty test script to save the time of setting up unit testing utiltiy.

```
import { container } from "../ioc/ioc";
import { TYPES } from "../ioc/types";
import { initializeDatabase } from "../helpers/database";
import { CarService } from "../service/carservice";
import { Car } from "../entity/car";
const Configue = require('configue');

(async () => {
    await initializeDatabase(await container.get<typeof Configue>(TYPES.Configue));
    const service = await container.get<CarService>(TYPES.CarService);
    
    //Ask for all cars
    let result: any = await service.findAll();

    console.log('\nShould print out "[]" - we haven\'t put any cars in the database yet.');
    console.log(JSON.stringify(result, null, 5));

    //Test adding a couple cars
    let entity = new Car();
    entity.color = 'red';
    entity.entryNumber = 57;
    entity.make = 'Ferrari';
    entity.model = '488 GT-LM';

    result = await service.save(entity);

    console.log('\nShould print out the data for the car we just added.  "id" property should be set in the result.');
    console.log(JSON.stringify(result, null, 5));

    entity = new Car();
    entity.color = 'white';
    entity.entryNumber = 912;
    entity.make = 'Porsche';
    entity.model = '911 RSR';

    result = await service.save(entity);

    console.log('\nShould print out the data for the car we just added.  "id" property should be set in the result.');
    console.log(JSON.stringify(result, null, 5));
    
    //Save the Porsche's ID for later
    const insertedID = result.id;

    //Check that both cars were saved in the database
    result = await service.findAll();

    console.log('\nShould print out the data for both cars');
    console.log(JSON.stringify(result, null, 5));
    
    //Retrieve the Porsche from the database
    console.log(`Querying for ID ${insertedID}`);
    const retrievedEntity = await service.findById(insertedID);
    
    //guard against undefined result 
    if (!retrievedEntity) {
        console.log('We didn\'t find the Porsche, bailing out');
        return;
    }
    
    console.log('\nShould print out the data for the Porsche');
    console.log(JSON.stringify(result, null, 5));
    
    //Update the entry number and save
    retrievedEntity.entryNumber = 911;
    result = await service.save(retrievedEntity);
    
    console.log('\nShould print out the Porsche with updated entry number');
    console.log(JSON.stringify(result, null, 5));
    
    //Delete the Porsche
    result = await service.delete(insertedID);

    //List all cars, we should only have the Ferrari left.
    result = await service.findAll();

    console.log('\nShould print out just the Ferrari');
    console.log(JSON.stringify(result, null, 5));

    //Delete any remaining cars so we have an empty database
    for (let e of result) {
        await service.delete(((e.id as number)));
    }

    //Check that the db is empty
    result = await service.findAll();
    console.log('\nShould print []');
    console.log(JSON.stringify(result, null, 5));    
})();
```

This script will:

1. Query the database to verify that it's empty
1. Insert two cars
1. Verify those cars were inserted by querying for all cars
1. Retrieve one specific car by ID
1. Update the car we just retrieved
1. Test that the update was persisted by reading the car back from the database
1. Delete the car we updated 
1. Test the delete by querying for all cars
1. Clean up the database by deleting any remaining cars.

You can run the script by running this command from the project root:

```
npx tsc && node dist/testscripts/car.js
```

You should see the following output:

```
craigdrktxmqmbp:starter craigdrabik$ npx tsc && node dist/testscripts/car.js
2021-11-11 16:54:07 [info]:     Created service CarService 

Should print out "[]" - we haven't put any cars in the database yet.
[]

Should print out the data for the car we just added.  "id" property should be set in the result.
{
     "color": "red",
     "entryNumber": 57,
     "make": "Ferrari",
     "model": "488 GT-LM",
     "id": 13
}

Should print out the data for the car we just added.  "id" property should be set in the result.
{
     "color": "white",
     "entryNumber": 912,
     "make": "Porsche",
     "model": "911 RSR",
     "id": 14
}

Should print out the data for both cars
[
     {
          "id": 13,
          "make": "Ferrari",
          "model": "488 GT-LM",
          "color": "red",
          "entryNumber": 57
     },
     {
          "id": 14,
          "make": "Porsche",
          "model": "911 RSR",
          "color": "white",
          "entryNumber": 912
     }
]
Querying for ID 14

Should print out the data for the Porsche
[
     {
          "id": 13,
          "make": "Ferrari",
          "model": "488 GT-LM",
          "color": "red",
          "entryNumber": 57
     },
     {
          "id": 14,
          "make": "Porsche",
          "model": "911 RSR",
          "color": "white",
          "entryNumber": 912
     }
]

Should print out the Porsche with updated entry number
{
     "id": 14,
     "make": "Porsche",
     "model": "911 RSR",
     "color": "white",
     "entryNumber": 911
}

Should print out just the Ferrari
[
     {
          "id": 13,
          "make": "Ferrari",
          "model": "488 GT-LM",
          "color": "red",
          "entryNumber": 57
     }
]

Should print []
[]
craigdrktxmqmbp:starter craigdrabik$ 
```

### Using the CrudService class

As you can probably tell, you'll have a lot of services where the basic CRUD methods are copy-paste from other services.  We can handle all of our CRUD operations for all of our entities generically.  The framework includes a CrudService class that you can extend to implement the CRUD methods for a given entity.  Let's convert our CarService class to use CrudService:

```
import { inject, injectable } from "inversify";
import { Car } from "../entity/car";
import { Logger } from "winston";
import { TYPES } from "../ioc/types";
import { Repository } from "typeorm";
import { CrudService } from "./crudservice";

@injectable()
class CarService extends CrudService<Car> {
    constructor(
        @inject(TYPES.CarRepository) repository: Repository<Car>,
        @inject(TYPES.Logger) logger: Logger
    ) { 
        super(repository, logger);
        this.logger.info('Created service CarService');
    }    
}

export { CarService }
```

To convert, we extend CrudService and specify the type of entity the service will handle (```extends CrudService<Car>```) and add the ```super()``` invokation in the constructor.  We can then remove our entity-specific findById/findAll/save/delete routines.  We can re-run our tests to make sure everything still works.


### Adding Additional Functionality to Services

Creating basic CRUD services in the framework is really easy using CrudService.  In many cases though we'll have specific operations we need to perform that go beyond simple CRUD.  As an easy example, suppose we want to be able to query all cars for a given make.  Let's add a method to our CarService to do that, and add to our test to make sure it works.

We've seen TypeORM's ```find()``` method already - we used to to query all cars from the database.  ```find()``` can take a number of parameters that tell TypeORM how to query the data.  In this case, we want to retrieve all cars that have a certain value in the "make" property.

```
import { inject, injectable } from "inversify";
import { Car } from "../entity/car";
import { Logger } from "winston";
import { TYPES } from "../ioc/types";
import { Repository } from "typeorm";
import { CrudService } from "./crudservice";

@injectable()
class CarService extends CrudService<Car> {
    constructor(
        @inject(TYPES.CarRepository) repository: Repository<Car>,
        @inject(TYPES.Logger) logger: Logger
    ) { 
        super(repository, logger);
        this.logger.info('Created service CarService');
    }    

    public async findByMake(make: string): Promise<Array<Car>> {
        const result = await this.repository.find({ where: { make } })
        return result;
    }
}

export { CarService }
```

In our test script, let's add a call to ```findByMake()``` to find all the Ferraris right after we verify that both cars were inserted into the database:

```
    //Find all Ferraris to test findByMake()
    result = await service.findByMake('Ferrari');
    console.log('\nShould only include Ferraris');
    console.log(JSON.stringify(result, null, 5));
```

If we rebuild and re-run our tests we'll see the output:

```
Should only include Ferraris
[
     {
          "id": 15,
          "make": "Ferrari",
          "model": "488 GT-LM",
          "color": "red",
          "entryNumber": 57
     }
]
```