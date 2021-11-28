import { Column, Entity, Unique, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Car } from './car'
import { Race } from './race'
import { Driver } from './driver'
import { Class } from './class'

@Entity()
@Unique('unique_result_index', ['car', 'race', 'driver'])
class RaceResult {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column('int')
    carNumber?: number

    @ManyToOne(() => Race, race => race.results, {
        // cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: false
    })
    race?: Race

    @ManyToOne(() => Class, _class => _class.results, {
        nullable: false
    })
    class?: Class

    @ManyToOne(() => Car, car => car.results, {
        nullable: false
    })
    car?: Car

    @ManyToOne(() => Driver, driver => driver.results, {
        // cascade: true,
        onDelete: 'CASCADE',
        nullable: false
    })
    driver?: Driver

    @Column('int', {
        nullable: false
    })
    startingPosition?: number

    @Column('int', {
        nullable: true
    })
    finishingPosition?: number

    @Column('bool', {
        nullable: true
    })
    isFinished?: boolean
}

export { RaceResult }