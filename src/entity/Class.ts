import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Class {
    @PrimaryGeneratedColumn('uuid')
    id?: number;

    @Column('varchar', {
        nullable: false,
        length: 50
    })
    name?: string;
}

export { Class }