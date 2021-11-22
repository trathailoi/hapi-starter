import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Address } from './Address';

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
  
  @OneToOne(() => Address)
  @JoinColumn()
  homeAddress?: Address;

  @OneToOne(() => Address)
  @JoinColumn()
  managementAddress?: Address;
}

export { Driver }