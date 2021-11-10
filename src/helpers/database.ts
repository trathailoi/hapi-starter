import { Car } from '../entity/car';
import { createConnection } from 'typeorm';



/**
 * This class is responsible for intiializing a connection to the database through TypeORM.
 */
// TODO: Externalize connection properties
async function initializeDatabase(config: any) {
    //const entities = [path.normalize(__dirname + '/../entity/*.{ts,js}')];
    const entities = [Car];
    
    await createConnection({
        type: config.get('database.type', 'postgres'),
        host: config.get('database.host', 'localhost'),
        port: config.get('database.port', 5432),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.database', 'sevenmiles'),
        entities: entities,
        synchronize: config.get('database.synchronize', true)
    });
}

export { initializeDatabase }