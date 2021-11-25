import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm'
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

    @OneToOne(() => Address)
    @JoinColumn()
    businessAddress?: Address

    // @ManyToMany(() => Driver)
    // @JoinTable()
    // drivers?: Driver[]

    @OneToMany(() => Car, car => car.team)
    cars?: Car[]
}

export { Team }