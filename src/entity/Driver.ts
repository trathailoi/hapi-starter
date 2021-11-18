import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Address } from './Address';

export type NationalityType = 'USA' | 'Viet Nam'
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
    enum: ['USA', 'Viet Nam']
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