import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { Address } from './address'
import { Driver } from './driver'
import { Car } from './car'

export enum Nationality {
    USA = 'USA',
    VietNam = 'Viet Nam'
}

@Entity()
class Team {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column('varchar', {
        nullable: false,
        length: 150
    })
    name?: string

    @Column({
        type: 'enum',
        enum: Nationality,
        default: Nationality.USA
    })
    nationality?: Nationality

    @ManyToOne(() => Address)
    businessAddress?: Address

    @ManyToMany(() => Driver, driver => driver.teams, {
        cascade: true
    })
    @JoinTable()
    drivers?: Driver[]

    @OneToMany(() => Car, car => car.team)
    cars?: Car[]
}

export { Team }