import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Address } from './Address';
import { Team } from './Team';
import { RaceResult } from './RaceResult';

export enum Nationality {
    USA = 'USA',
    VietNam = 'Viet Nam'
}

@Entity()
class Driver {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar', {
        nullable: false,
        length: 50
    })
    firstName?: string;

    @Column('varchar', {
        nullable: false,
        length: 50
    })
    lastName?: string;

    @Column({
        type: 'enum',
        enum: Nationality,
        default: Nationality.USA
    })
    nationality?: Nationality;

    @OneToOne(() => Address)
    @JoinColumn()
    homeAddress?: Address

    @OneToOne(() => Address)
    @JoinColumn()
    managementAddress?: Address

    @ManyToMany(() => Team)
    @JoinTable()
    teams?: Team[];

    @OneToMany(() => RaceResult, raceResult => raceResult.driver)
    results?: RaceResult[];
}

export { Driver }