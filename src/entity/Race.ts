import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from './Class';
import { RaceCar } from './RaceCar';

@Entity()
class Race {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar', { length: 100 })
  name?: string;

  @ManyToMany(() => Class)
  @JoinTable()
  classes?: Class[];

  @OneToMany(() => RaceCar, raceCar => raceCar.race)
  raceCars?: RaceCar[]
}

export { Race }