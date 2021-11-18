import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Address } from './Address';
import { Car } from './Car';

@Entity()
class Team {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar', { length: 100 })
  name?: string;

  @Column({
    type: 'enum',
    enum: ['USA', 'Viet Nam']
  })
  nationality?: string;    

  @OneToOne(() => Address)
  @JoinColumn()
  businessAddress?: Address;

  @OneToMany(() => Car, car => car.team)
  cars?: Car[]
}

export { Team }