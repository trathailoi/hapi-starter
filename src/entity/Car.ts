import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    /*
        @PrimaryGeneratedColumn indicates that this field is a primary key 
        in the database, and that it should be automatically populated from 
        a sequence by the database during inserts.

        Generally, this is how we want to define our key fields (generated), 
        but there are other options for other situations.  

        Note that each entity MUST have a primary key column.
    */
    @PrimaryGeneratedColumn()
    id?: number;

    /*
        Each field that gets stored in the database needs to have a @Column
        annotation.  This annotation tells TypeORM how the field should be
        represented in the database - it's data type, length, and the name
        of the column.

        Understand that SQL databases generally have more detailed typing
        than we have available to us in Javascript.  For example, here are 
        multiple kinds of numeric fields available in a SQL database (int, 
        bigint, float, long, double, etc.) while in Javascript we have only
        number.

        One item to pay attention to is "nullable" - this tells the database
        whether or not a value is required for that field.  If you don't pay
        attention to its setting you may find yourself seeing errors on insert
        if a field is undefined.
    */
    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'make'
    })
    make?: string;

    @Column('varchar', {
        nullable: false,
        length: 40,
        name: 'model'
    })
    model?: string;

    @Column('varchar', {
        nullable: false,
        length: 10,
        name: 'color'
    })
    color?: string;    
    
    @Column('int', {
        nullable: false,
        name: 'entrynumber'
    })
    entryNumber?: number;
}

export { Car }