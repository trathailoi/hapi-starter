import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Car } from './car'
import { Race } from './race'
import { Driver } from './driver'
import { Class } from './class'

@Entity()
class RaceResult {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @ManyToOne(() => Car)
    car?: Car

    @Column('int', {
        nullable: false
    })
    carNumber?: string

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
        nullable: false
    })
    finishingPosition?: number

    @Column('bool', {
        nullable: false
    })
    isFinished?: boolean
}

export { RaceResult }