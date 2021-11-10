import * as path from 'path';
import { Car } from '../entity/car';
import { createConnection } from 'typeorm';



/**
 * This class is responsible for intiializing a connection to the database through TypeORM.
 */
// TODO: Externalize connection properties
async function initializeDatabase() {
    //const entities = [path.normalize(__dirname + '/../entity/*.{ts,js}')];
    const entities = [Car];
    
    
    await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'sevenmiles',
        password: 'Passw0rd!',
        database: 'sevenmiles',
        entities: entities,
        synchronize: true
    });
}

export { initializeDatabase }