import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Car } from './Car';
import { Race } from './Race';
import { Driver } from './Driver';
import { Class } from './Class';

@Entity()
class RaceResult {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => Car)
    car?: string;

    @Column('int', {
        nullable: false
    })
    carNumber?: string;

    @ManyToOne(() => Race)
    race?: string;

    @ManyToOne(() => Driver)
    driver?: string;

    @ManyToOne(() => Class)
    class?: Class[]

    @Column('int', {
        nullable: false
    })
    startPosition?: number;

    @Column('int', {
        nullable: false
    })
    finishPosition?: number;

    @Column('bool', {
        nullable: false
    })
    isFinished?: boolean;
}

export { RaceResult }