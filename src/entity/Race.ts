import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { RaceResult } from './race-result'

@Entity()
class Race {
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @Column('varchar', {
        nullable: false,
        length: 50
    })
    name?: string

    @OneToMany(() => RaceResult, raceResult => raceResult.race)
    results?: RaceResult[]
}

export { Race }