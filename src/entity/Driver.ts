import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { Address } from './Address';

export enum Nationality {
    USA = 'USA',
    VietNam = 'Viet Nam'
}

@Entity()
class Driver {
    @PrimaryGeneratedColumn('uuid')
    id?: number;

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
}

export { Driver }