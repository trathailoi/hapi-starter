import 'reflect-metadata';
import { injectable } from "inversify";

@injectable()
class Logger {
    public info(message: string): void {
        console.log(message);
    }
}

export { Logger };