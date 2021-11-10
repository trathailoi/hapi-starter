import { Container } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from './types';
import { HelloWorldController } from '../api/helloworld-controller';
import { ApiServer } from '../apiserver';
import { Controllers } from '../api/controllers';
import { getConnection, Repository } from 'typeorm';
import { Car } from '../entity/car';
import * as Winston from 'winston';
import { CarService } from '../service/carservice';
import { CarController } from '../api/car-controller';
const Configue = require('configue');

/**
 * This file contains all of the Inversify configuration code.  This is the only
 * place that we should have hard dependencies on any controllers, services, and
 * utilities that we will provide to classes using dependency injection.
 * 
 * Each class managed using inversify will be represented somewhere in this class.
 * 
 * The first step is to create an Inversify container.  The container manages all
 * of the injectable dependencies.  You can tell it how you want each dependency 
 * managed (for example, is it a singleton, or does each reference get its own 
 * instance?) and let the container manage instantiating and injecting dependencies.
 */
const container = new Container();


/**
 * Next, we're going to initialize Configue to help us with externalizing configuration 
 * parameters.  This is the first thing we need, as we can't configure Winston without
 * a log level.
 * 
 * In this case, we use .toConstantValue() because we are already manually creating an
 * instance of Configuue since we need it locally.
 */
const configOpts = {
  defer: false,
  disable: { argv: true },
  files: [
    { 
      file: './dist/config/config.yaml',
      format: require('nconf-yaml')
    }
  ]
};
const configue = new Configue(configOpts);
container.bind<typeof Configue>(TYPES.Configue).toConstantValue(configue);

/**
 * Configure Winston for logging
 */
container.bind<Logger>(TYPES.Logger).toDynamicValue(
    () => {
        const consoleTransport = new Winston.transports.Console({
            format: Winston.format.combine(
              Winston.format.colorize(),
              Winston.format.timestamp(),
              Winston.format.align(),
              Winston.format.printf(info => {
                const { timestamp, level, message, ...args } = info;
      
                const ts = timestamp.slice(0, 19).replace('T', ' ');
                return `${ts} [${level}]: ${message} ${
                  Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
                }`;
              })
            ),
            level: configue.get('logging.level'),
          });
      
          return Winston.createLogger({
            transports: [consoleTransport],
          });
    }
).inSingletonScope();

// "Global" classes - things that aren't controllers, repositories, or services.
/**
 * For each dependency we set up a binding in the container to the class that implements 
 * each dependency.  Remember that the purpose of dependency injection/inversion of control 
 * is to avoid hard bindings to things.
 * 
 * To achieve the full benefits of DI, you can use Typescript interfaces to disconnect an
 * object from its implementing class.  This is kind of a lot of work for not a lot of 
 * real-world benefit.  However, they have their place - especially in testing.  You can
 * create different classes that implement the same interface, such as a mock service 
 * that works with dummy data versus a real service that interacts with the database.  If
 * both the mock and the real service implement the same interface, you can provide either
 * the mock or the real service at runtime and dependent code won't know the difference.
 * 
 * Inversify prepares us for this by binding a "source type" (in this case ApiServer) to a
 * symbol - a representation of that type, and bind the symbol to the implemnting class.
 * Below, we bind the symbol TYPES.ApiServer to the class ApiServer.  The "".inSingletonScope()"
 * part of the declaration tells Inversify that we want everyone who needs an ApiServer to
 * get the same instance of ApiServer.
 */
container.bind<ApiServer>(TYPES.ApiServer).to(ApiServer).inSingletonScope();
container.bind<Controllers>(TYPES.Controllers).to(Controllers).inSingletonScope();

// Controllers
container.bind<HelloWorldController>(TYPES.HelloWorldController).to(HelloWorldController).inSingletonScope();
container.bind<CarController>(TYPES.CarController).to(CarController).inSingletonScope();

// TypeORM repositories
/**
 * Bindings for repositories are a little different.  We have a convenience method to create
 * TypeORM repositories from an entity class - calling createRepository with the "Car" entity
 * creates an entity that brokers database calls to the "Car" table.
 * 
 * This syntax simply lets us pass a function that creates an instance of a dependency in cases 
 * where Inversify doesn't have enough information to create the instance itself.
 */
container.bind<Repository<Car>>(TYPES.CarRepository).toDynamicValue(
  () => createRepository<Car>(Car)
).inSingletonScope()

// Services
container.bind<CarService>(TYPES.CarService).to(CarService).inSingletonScope();

/**
 * Utility function to create TypeORM repositories from their types through generics
 */
 function createRepository<T>(c: { new (): T }): Repository<T> {
  return getConnection().getRepository(c);
}

export { container }