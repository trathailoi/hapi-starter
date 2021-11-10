import { injectable } from "inversify";
import { Logger } from "winston";
import { DeleteResult, Repository } from "typeorm";

@injectable()
class CrudService<T> {
    
    constructor(protected repository: Repository<T>, protected logger: Logger) { }

    public async findById(id: number): Promise<T | undefined> {
        return this.repository.findOne(id);
    }

    public async findAll(): Promise<Array<T>> {
        const result = await this.repository.find();
        return result;
    }

    public async save(entity: T): Promise<T | undefined> {
        return this.repository.save(entity);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}

export { CrudService }