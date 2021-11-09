import * as path from 'path';
import { createConnection } from 'typeorm';



// Database Setup
async function initializeDatabase() {
    const entities = [path.normalize(__dirname + '/../entity/*.ts')];
    
    await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'sevenmiles',
        password: 'Passw0rd!',
        database: 'sevenmiles',
        entities: entities,
        synchronize: false
    });
}

export { initializeDatabase }