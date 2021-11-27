import { injectable } from 'inversify'
import { Logger } from 'winston'
import { DeleteResult, Repository } from 'typeorm'
@injectable()
class CrudService<T> {
    
    constructor(protected repository: Repository<T>, protected logger: Logger) { }

    public async findById(id: string): Promise<T | undefined> {
        return await this.repository.findOne(id)
    }

    public async findByIds(ids: T[]): Promise<Array<T>> {
      return await this.repository.findByIds(ids)
    }

    public async findAll(queryObject?: {where?: {}, relations?: string[], pagination?: { pageSize?: number, currentPage?: number }, order?: {}}): Promise<{data: Array<T>, count: number}> {
        const defaultPaginationConf = { take: 20, skip: 0 } // skip: take * (page - 1)
        let queryObj: {} = {}
        if (queryObject?.where && Object.keys(queryObject?.where).length > 0) {
            queryObj = { ...queryObj, where: queryObject?.where }
        }
        if (queryObject?.relations && queryObject?.relations.length > 0) {
            queryObj = { ...queryObj, relations: queryObject?.relations }
        }
        if (queryObject?.pagination && Object.keys(queryObject?.pagination).length > 0) {
            if (queryObject.pagination.pageSize){
                defaultPaginationConf.take = queryObject.pagination.pageSize
            }
            if (queryObject.pagination.currentPage){
                defaultPaginationConf.skip = defaultPaginationConf.take * (queryObject.pagination.currentPage - 1)
            }
            queryObj = { ...queryObj, ...defaultPaginationConf }
        }
        if (queryObject?.order &&  Object.keys(queryObject?.order).length > 0) {
            queryObj = { ...queryObj, order: queryObject?.order }
        }
        console.log('queryObj', queryObj)
        const result = await this.repository.findAndCount(queryObj)
        return {
            data: result[0],
            count: result[1]
        }
    }

    public async save(entity: T): Promise<T | undefined> {
        return await this.repository.save(entity)
    }

    public async saveMany(entities: Array<T>): Promise<Array<T>> {
      return await this.repository.save(entities)
    }

    public async delete(id: string): Promise<DeleteResult> {
        return await this.repository.delete(id)
    }
}

export { CrudService }