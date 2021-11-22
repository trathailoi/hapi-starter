import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { Address } from './Address';

export enum Nationality {
    USA = 'USA',
    VietNam = 'Viet Nam'
}

@Entity()
class Team {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar', {
        nullable: false,
        length: 150
    })
    name?: string;

    @Column({
        type: 'enum',
        enum: Nationality,
        default: Nationality.USA
    })
    nationality?: Nationality;

    @OneToOne(() => Address)
    @JoinColumn()
    businessAddress?: Address
}

export { Team }