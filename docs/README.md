# Starter Project

## What it is  
This starter project sets up an architecture for building REST services using the following tooling:
- HAPI:  A Javascript web framework for building powerful, scalable applications with minimal overhead and full out of the box functionality
- Typescript:  An extension to Javascript that introduces compile-time type checking similar to what's found in a language like Java
- TypeORM:  An object-relational mapping framework
- Inversify:  A dependency injection and inversion of control (IoC) fraamework.

The starter also establishes some good architectural practices - separation of concerns, inversion of control, etc - and provides some conveniences for developers such as HAPI route configuration via metadata and a flexible method for externalizing configuration parameters.

## Why it exists?
7 Miles Global has twice attempted to build a software product called MASI, with both attempts falling short of their goals.  In order to have a better chance at success, several architectural concerns were identified.  The architecture implemented in this starter project is an attempt to address those concerns technically.  At the same time, we didn't want to throw out parts of the architecture developers were already familiar with (like HAPI).

Given that there was a good amount of change for developers, it made sense to create this starter to bootstrap development on the new architecture.

## What else should it probably do?
- Testing!  This is a big item on the TODO list!
- Swagger/OpenAPI.  It would be helpful just to have the schema generated from what's implemented and exposed through SwaggerUI - that's blocked on some library incompatibilities.  The big payoff in the end comes from being able to define your APIs using YAML documents in OpenAPI format and using those definitions to code-generate your data transfer objects and client- and server-side service stubs.  This is more of a medium-term goal
- Authentication.  I did not implement any sort of authentication mechanism.
- Caching.  I wanted to keep things simple for now.  It probably will make sense to re-introduce Redis caching at some point in the future.

## Getting Started
Getting up and running with the starter kit should be easy.  You'll need a few dependencies before you begin:
- NodeJS v16 and the bundled version of NPM
- A PostgreSQL database.  I recommend developers run one using Docker.  I've included a shell script in the database folder that will start one up for you (sorry, if you're running Windows you'll have to port it!).  You can also instal PostgreSQL locally or use one running on a server somewhere.

Once you have your dependencies installed, follow these steps:
1. Clone this repository.
1. Start your PostgreSQL instance.  There's a script to help do this using Docker in database/start.sh
1. Configure your database settings.  If you're using the included script to start a PostgreSQL container using Docker, you won't need to change any settings.  Change settings in src/config/config.yaml if you do need to make changes.
1. ```npm i``` to install all dependencies
1. ```npm run nodemon:build``` will run the typescript build and launch the application.  Nodemon will watch for changes to .ts files and recompile/relaunch the application as you code.
1. Using Postman (or a browser), navigate to http://localhost:8080/api/helloworld and you should see a response.

The starter code is pretty well documented so please do look at the code as you follow along with the additional documentation in the next section.

## Tutorial

I've put together a walkthrough of each of the aspects of the architecture and explained what they are, how they're used, and how to create them.

1. [What is a DTO/controller/entity/service/etc and why do we use them?](what-is-this.md)
1. [How do I work with entities and services (database objects)?](working-with-entities-services.md)
1. [How do I work with models (data transfer objects), and how do I convert between models and entities?](working-with-models.md)
1. [How do I add a new controller?](add-controller.md)
1. [How do I add a new HAPI route?](add-hapi-route.md)

You can find the code referenced in the walkthroughs in the feature/cars-walkthrough branch.