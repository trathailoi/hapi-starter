import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Car } from './Car';
import { Race } from './Race';
import { Driver } from './Driver';
import { Class } from './Class';

@Entity()
class RaceCar {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Car, car => car.raceCars)
  car?: Car;

  @ManyToOne(() => Race, race => race.raceCars)
  race?: Race;

  @ManyToOne(() => Driver)
  driver?: Driver;

  @ManyToOne(() => Class)
  class?: Class

  @Column()
  raceNumber?: string;

  @Column()
  startPosition?: number;

  @Column({ nullable: true })
  finishPosition?: number;

}

export { RaceCar }