import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm'
import { Address } from './address'
import { Team } from './team'
import { RaceResult } from './race-result'

export enum Nationality {
    USA = 'USA',
    VietNam = 'Viet Nam'
}

@Entity()
class Driver {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column('varchar', {
        nullable: false,
        length: 50
    })
    firstName?: string

    @Column('varchar', {
        nullable: false,
        length: 50
    })
    lastName?: string

    @Column({
        type: 'enum',
        enum: Nationality,
        default: Nationality.USA
    })
    nationality?: Nationality

    @ManyToOne(() => Address, address => address.id, {
        // cascade: true,
        nullable: true,
        onDelete: 'SET NULL'
    })
    homeAddress?: Address

    @ManyToOne(() => Address, address => address.id, {
        // cascade: true,
        nullable: true,
        onDelete: 'SET NULL'
    })
    managementAddress?: Address

    @ManyToMany(() => Team, team => team.drivers, {
        onDelete: 'CASCADE'
    })
    teams?: Team[]

    @OneToMany(() => RaceResult, raceResult => raceResult.driver)
    results?: RaceResult[]
}

export { Driver }