import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Address {
    @PrimaryGeneratedColumn('uuid')
    id?: number;

    @Column('varchar', {
        nullable: false,
        length: 150
    })
    name?: string;

    @Column('varchar', {
        nullable: false,
        length: 150
    })
    street?: string;

    @Column('varchar', {
        nullable: false,
        length: 150
    })
    street2?: string;

    @Column('varchar', {
        nullable: false,
        length: 40
    })
    city?: string;

    @Column('varchar', {
        nullable: false,
        length: 40
    })
    state?: string;

    @Column('varchar', {
        nullable: false,
        length: 40
    })
    country?: string;
}

export { Address }