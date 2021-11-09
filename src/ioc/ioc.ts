import { Container } from 'inversify';
import { Logger } from '../helpers/logger';
import { TYPES } from './types';
import { HelloWorldController } from '../api/helloworld-controller';
import { ApiServer } from '../apiserver';
import { Controllers } from '../api/controllers';
import { getConnection, Repository } from 'typeorm';
import { Car } from '../entity/Car';
import * as Winston from 'winston';
import { CarService } from '../service/carservice';
import { CarController } from '../api/car-controller';

const container = new Container();

//Utility function to create TypeORM repositories from their types
function createRepository<T>(c: { new (): T }): Repository<T> {
  return getConnection().getRepository(c);
}

// Set up logging through Winston
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
            level: process.env.LOG_LEVEL,
          });
      
          return Winston.createLogger({
            transports: [consoleTransport],
          });
    }
).inSingletonScope();

// "Global" classes
container.bind<ApiServer>(TYPES.ApiServer).to(ApiServer).inSingletonScope();
container.bind<Controllers>(TYPES.Controllers).to(Controllers).inSingletonScope();

// Controllers
container.bind<HelloWorldController>(TYPES.HelloWorldController).to(HelloWorldController).inSingletonScope();
container.bind<CarController>(TYPES.CarController).to(CarController).inSingletonScope();

// TypeORM repositories
container.bind<Repository<Car>>(TYPES.CarRepository).toDynamicValue(
  () => createRepository<Car>(Car)
)

// Services
container.bind<CarService>(TYPES.CarService).to(CarService).inSingletonScope();

export { container }