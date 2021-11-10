import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
class Car {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'make'
    })
    make?: string;

    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'model'
    })
    model?: string;

    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'vin'
    })
    vin?: string;

    @Column('varchar', {
        nullable: false,
        length: 10,
        name: 'color'
    })
    color?: string;    
}

export { Car }