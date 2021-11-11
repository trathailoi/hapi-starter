# What is a DTO/Controller/Entity/Service/etc?

This page should help to answer some common questions about each of the types of classes we have in our architecture.  In general, we're trying to set up an architecture that enforces good separation of concerns - each class works serves only one purpose, and works with other classes to do things for it instead of trying to do everything.  If we do this well, we wind up writing applications that can be easily extended to do new things, and we can reuse what we already have with no additional work.

## What's a DTO?

DTO stands for data transfer object.  This is the JSON format of the data that goes back and forth over the internet when web clients make REST requests.  It's important to understand that the structure of the data in the database isn't necessarily the best structure to send over the wire during a REST request, and that the structure we send over the wire might not be the best structure to work with that data in the web client.  DTOs are the piece that sits in the middle, and forms a common language for the client and server to communicate.

## What's an entity, and how is that different from a DTO?

Entities represent the data as it is structured in the database.  It's important to understand that entities are an *abstraction* for the database.  Entities don't exactly model the structures in a database.  For example, if you have a many-to-many relationship - for example if you still have a land-line phone in your house, every member of your family has a relationship to that phone number in addition to a relationship to their mobile number (many people related to many phone numbers).  In an SQL database, we'd have a table of people, and a table of phone numbers and in between we'd have a link table - a table that connects people to their phone numbers.

That relationship looks like this:
> Person - PersonToPhone - Phone

In an entity, you'd model it like this:
```
@Entity()
class Person {
    ...

    @ManyToMany(() => Phone)
    @JoinTable()
    phoneNumbers: Phone[];
}

@Entity()
class Phone {
    ...

    @ManyToMany(() => Person, person => person.phoneNumbers)
    categories: Phone[];
}
```

Check the [TypeORM documentation](https://github.com/typeorm/typeorm/tree/master/docs) for more information on defining entities and relationships between entities.

## So if we're working with DTOs at the API layer, and entities at the database layer, how do we translate between the two?

Great question.  We have to map them.  There's a utility called "automapper-ts" that we have available in the framework that will save us from having to hand-code the translations for each class.

## What's a service?

A service (in this context) is a class that is responsible for interacting with the database for one type of data.  The starter contains some example code that manages drivers and the cars they own.  In this example, we'd have entities for Driver and Car, and a one-to-many relationship between driver and car (a car is driven by one driver).  Now, there are many things we can do with a Driver or Car as it relates to the database.  We can load one or many or all Drivers or Cars from the database.  We can create new ones, we can delete old ones and so on.

The service wraps all of those operations for one entity.  So, if we have Driver and Car entities we will need Driver and Car services to implement the routines that manage them in the database.

The reason why we use the service abstraction here is that as our data model becomes more complex, we may need to be able to access Drivers and Cars in the database from many different API methods - we can use the same service in multiple route handlers.   Code is cleaner and more reusable.  We can also unit test our interactions with the database by unit testing the service and be confident that interacting with the database through the service will work everywhere.

## What's a controller?

Think of controllers like services but for HAPI routes instead of databases.  Following along with the previous examples, we would have a CarController that implements all the HAPI routes related to cars (using the CarService to work with the database) and a similar DriverController that implements all the HAPI routes related to drivers.

For us, controllers mostly serve to organize our HAPI route handlers - but by following this convention and using a base class for all our controllers, we can provide things to develoeprs "for free" that all controllers need - like the ability to configure HAPI routes or access to common utilities that most controllers would find useful.

## What are decorators, annotations, or metadata?

If you're not familiar with these concepts, don't worry - they're easy to understand.  You've seen them already, in the "entities" section of this document.  Annotations or metadata are simply additional data attached to your code.  They're the bits that start with an @.  Annotations are used all over the place in Java to do all sorts of things, and Typescript (and newer versions of Javascript) now bring these features to Java developers.

Looking back at our entity example, we had the following code:
```
@Entity()
class Person {
    ...

    @ManyToMany(() => Phone)
    @JoinTable()
    phoneNumbers: Phone[];
}
```

This little bit of code contains three annotations (all of them provided by TypeORM).  The first, ```@Entity```, tells TypeORM that this class represents a table in the database (class-level metadata).  The second, ```@ManyToMany``` tells TypeORM that the property it's attached to (phoneNumbers) represents a many-to-many relationship in the database.  That annotation includes a parameter that tells TypeORM what the type of the related entity is.  The third, ```@JoinTable``` tells TypeORM that it needs to use a join table to model this relationship.

You can write your own annotations in TypeScript, and the framework includes one - ```@HapiRoute``` that you add to controller methods that you want exposed as HapiRoutes.

## What is dependency injection?  What is inversion of control (IoC)?

As our applications become more complex, we either wind up writing a lot of code to do the same thing in multiple places, or we write code to manage the lifecycle of certain class instances (singletons).  This creates a lot of dependencies in our code between classes, and makes it more difficult to manage the code cleanly and more importantly test it.  What would be best is if the developer could just say "here, I need a logger and a service that can manage Cars" and not have to manually go get those things.

Dependency injection solves that challenge - I just need something to do my work and I don't want to figure out how or where to get it.  At runtime, a dependency injection container looks at newly created classes, inspects them for metadata that describes what dependencies that class needs, and automatically wires those dependencies into the newly created class.

We're using the Inversify framework to implement dependency injection.  Inversify works through annotations.  Consider this code:
```
@injectable()
class SomeClass {
    @inject('Logger')
    private logger: Logger;

    ...
}
```

Here, we are saying that SomeClass needs an instance of the logger - we do that by annotating the property that will hold the reference to the logger with an ```@inject``` annotation.  At runtime, Inversify figures out what a "Logger" is, creates one if necessary, and sets the logger property with that value.

Inversion of control or IoC is a related concept that helps to make dependency injection work.  What IoC means architecturally is that developers don't directly create instances of many classes in their application - and therefore they don't have to manage how they're created, passed around, or destroyed.  Instead, they simply ask the IoC container for one (either directly or through dependency injection).  The IoC container knows how to create and configure the classes, and it knows if for example everyone who asks should get their own instance or if everyone shares the same instance.

IoC takes some getting used to because you don't necessarily know when or where something is created, or how it's managed.  That's actually the point - you shouldn't have to know beyond the initial setup - but it does take some getting used to.