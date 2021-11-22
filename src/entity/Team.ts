import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { Address } from './Address';
import { Car } from './Car';
import { Driver } from './Driver';

export enum NationalityType {
  usa = 'USA',
  vietnam = 'Viet Nam'
}

@Entity()
class Team {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar', { length: 100 })
  name?: string;

  @Column({
    type: 'enum',
    enum: NationalityType
  })
  nationality?: NationalityType;    

  @OneToOne(() => Address)
  @JoinColumn()
  businessAddress?: Address;

  @ManyToMany(() => Driver)
  @JoinTable()
  classes?: Driver[];

  @OneToMany(() => Car, car => car.team)
  cars?: Car[]
}

export { Team }