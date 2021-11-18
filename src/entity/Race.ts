import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

    @OneToMany(() => Class, carClass => carClass.id)
    class?: Class[]
}

export { Race }