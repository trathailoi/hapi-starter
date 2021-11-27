import { Column, Entity, Unique, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Car } from './car'
import { Race } from './race'
import { Driver } from './driver'
import { Class } from './class'

@Entity()
@Unique('index_name', ['car', 'race', 'driver'])
class RaceResult {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @ManyToOne(() => Car)
    car?: Car

    @Column('int', {
        nullable: false
    })
    carNumber?: number

    @ManyToOne(() => Race)
    race?: Race

    @ManyToOne(() => Driver)
    driver?: Driver

    @ManyToOne(() => Class)
    class?: Class

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