import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RaceCar } from './RaceCar';

@Entity()
class Race {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar', { length: 100 })
  name?: string;

  @OneToMany(() => RaceCar, raceCar => raceCar.race)
  raceCars?: RaceCar[]
}

export { Race }