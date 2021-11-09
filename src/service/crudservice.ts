import { injectable } from "inversify";
import { Logger } from "../helpers/logger";
import { DeleteResult, Repository } from "typeorm";

@injectable()
class CrudService<T> {
    
    constructor(protected repository: Repository<T>, protected logger: Logger) { }

    public async findById(id: number): Promise<T | undefined> {
        return this.repository.findOne(id);
    }

    public async find(where?: any): Promise<Array<T> | undefined> {
        return this.repository.find({ where });
    }

    public async save(entity: T): Promise<T | undefined> {
        return this.repository.save(entity);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}

export { CrudService }