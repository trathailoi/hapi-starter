import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import { Address } from './Address';
import { RaceResult } from './RaceResult';
import { Team } from './Team';

export enum NationalityType {
  usa = 'USA',
  vietnam = 'Viet Nam'
}

@Entity()
class Driver {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('varchar', { length: 40 })
  firstName?: string;

  @Column('varchar', { length: 40 })
  lastName?: string;

  @Column({
    type: 'enum',
    enum: NationalityType
  })
  nationality?: NationalityType;
  
  @OneToOne(() => Address, address => address.id, { cascade: true })
  @JoinColumn()
  homeAddress?: Address;

  @OneToOne(() => Address, address => address.id, { cascade: true })
  @JoinColumn()
  managementAddress?: Address;

  @ManyToMany(() => Team, team => team.drivers)
  teams?: Team[];

  @OneToMany(() => RaceResult, raceResult => raceResult.driver)
  raceResults?: RaceResult[]
}

export { Driver }