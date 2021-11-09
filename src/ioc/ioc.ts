import { Container } from 'inversify';
import { Logger } from '../helpers/logger';
import { TYPES } from './types';
import { HelloWorldController } from '../api/helloworld/controller';
import { ApiServer } from '../apiserver';

const container = new Container();

container.bind<Logger>(TYPES.Logger).to(Logger);
container.bind<ApiServer>(TYPES.ApiServer).to(ApiServer);
container.bind<HelloWorldController>(TYPES.HelloWorldController).to(HelloWorldController);

debugger;

export { container }