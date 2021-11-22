import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Class } from './Class';

@Entity()
class Race {
    @PrimaryGeneratedColumn('uuid')
    id?: number;

    @Column('varchar', {
        nullable: false,
        length: 50
    })
    name?: string;

    @ManyToMany(() => Class)
    @JoinTable()
    classes?: Class[]
}

export { Race }