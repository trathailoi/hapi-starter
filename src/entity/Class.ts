import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RaceResult } from './RaceResult';

@Entity()
class Class {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('varchar', {
        nullable: false,
        length: 50
    })
    name?: string;

    @OneToMany(() => RaceResult, raceResult => raceResult.class)
    results?: RaceResult[];
}

export { Class }