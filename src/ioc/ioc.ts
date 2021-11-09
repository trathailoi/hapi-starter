import { Container } from 'inversify';
import { Logger } from '../helpers/logger';
import { TYPES } from './types';
import { HelloWorldController } from '../api/helloworld/controller';

const container = new Container();

container.bind<Logger>(TYPES.Logger).to(Logger);
container.bind<HelloWorldController>(TYPES.HelloWorldController).to(HelloWorldController);

export { container }