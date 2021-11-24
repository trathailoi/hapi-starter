import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Class } from './Class';
import { Team } from './Team';
import { RaceResult } from './RaceResult';

/**
 * This class defines an entity that represents cars in the database.  
 * Each car has a make, model, VIN number, and color.  Later on, I'll 
 * add owners to show how we model relationships between different entities.
 * 
 * Note the @Entity() annotation on the class - this annotation tells TypeORM
 * that this class represents a table in the database.  Changes made to this
 * entity will result in changes in the database structure (so be careful!).
 * TODO: Add Owner entity.
 */
@Entity()
class Car {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar', {
        nullable: false,
        length: 40
    })
    make?: string;

    @Column('varchar', {
        nullable: false,
        length: 40
    })
    model?: string;

    @ManyToOne(() => Class)
    class?: string;

    @ManyToOne(() => Team)
    team?: string;

    @OneToMany(() => RaceResult, raceResult => raceResult.car)
    results?: RaceResult[];
}

export { Car }