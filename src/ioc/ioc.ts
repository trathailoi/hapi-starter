import { Container } from 'inversify';
import { Logger } from '../helpers/logger';
import { TYPES } from './types';
import { HelloWorldController } from '../api/helloworld/controller';
import { ApiServer } from '../apiserver';
import * as Winston from 'winston';
import { Controllers } from '../api/controllers';

const container = new Container();
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

container.bind<ApiServer>(TYPES.ApiServer).to(ApiServer).inSingletonScope();
container.bind<Controllers>(TYPES.Controllers).to(Controllers).inSingletonScope();
container.bind<HelloWorldController>(TYPES.HelloWorldController).to(HelloWorldController).inSingletonScope();

export { container }