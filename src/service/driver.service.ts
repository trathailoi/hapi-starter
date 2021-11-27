import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Repository } from 'typeorm'
import { TYPES } from '../ioc/types'
import { CrudService } from './crudservice'
import { Driver } from '../entity/driver'
import { TeamService } from './team.service'

@injectable()
class DriverService extends CrudService<Driver> {
  constructor(
    @inject(TYPES.DriverRepository) repository: Repository<Driver>,
    @inject(TYPES.TeamService) private teamService: TeamService,
    @inject(TYPES.Logger) logger: Logger
  ) {
    super(repository, logger)
    this.logger.info('Created DriverService')
  }

  public async save(entity: Driver): Promise<Driver | undefined> {
    if (entity.teams && entity.teams.length) {
      const teams = await this.teamService.findByIds(entity.teams)
      entity.teams = teams
    }
    const result = await this.repository.save(entity)
    return result
  }

  public async findById(id: string): Promise<Driver | undefined> {
    const result = await this.repository.findOne({
      where: { id },
      relations: ['homeAddress', 'managementAddress', 'teams', 'results']
    })
    return result
  }

  public async findAll(queryObject?: {where?: {}, relations?: string[], pagination?: {}}): Promise<{data: Array<Driver>, count: number}> {
    return super.findAll({ relations : ['homeAddress', 'managementAddress', 'teams', 'results'], ...queryObject })
  }
}

export { DriverService }
