import { container } from "../ioc/ioc";
import { TYPES } from "../ioc/types";
import { initializeDatabase } from "../helpers/database";
import { CarService } from "../service/carservice";
import { Car } from "../entity/car";
const Configue = require('configue');

(async () => {
    await initializeDatabase(await container.get<typeof Configue>(TYPES.Configue));
    const service = await container.get<CarService>(TYPES.CarService);
    
    //Ask for all cars
    let result: any = await service.findAll();

    console.log('\nShould print out "[]" - we haven\'t put any cars in the database yet.');
    console.log(JSON.stringify(result, null, 5));

    //Test adding a couple cars
    let entity = new Car();
    entity.color = 'red';
    entity.entryNumber = 57;
    entity.make = 'Ferrari';
    entity.model = '488 GT-LM';

    result = await service.save(entity);

    console.log('\nShould print out the data for the car we just added.  "id" property should be set in the result.');
    console.log(JSON.stringify(result, null, 5));

    entity = new Car();
    entity.color = 'white';
    entity.entryNumber = 912;
    entity.make = 'Porsche';
    entity.model = '911 RSR';

    result = await service.save(entity);

    console.log('\nShould print out the data for the car we just added.  "id" property should be set in the result.');
    console.log(JSON.stringify(result, null, 5));
    
    //Save the Porsche's ID for later
    const insertedID = result.id;

    //Check that both cars were saved in the database
    result = await service.findAll();

    console.log('\nShould print out the data for both cars');
    console.log(JSON.stringify(result, null, 5));
    
    //Find all Ferraris to test findByMake()
    result = await service.findByMake('Ferrari');
    console.log('\nShould only include Ferraris');
    console.log(JSON.stringify(result, null, 5));
    
    //Retrieve the Porsche from the database
    console.log(`Querying for ID ${insertedID}`);
    const retrievedEntity = await service.findById(insertedID);
    
    //guard against undefined result 
    if (!retrievedEntity) {
        console.log('We didn\'t find the Porsche, bailing out');
        return;
    }
    
    console.log('\nShould print out the data for the Porsche');
    console.log(JSON.stringify(result, null, 5));
    
    //Update the entry number and save
    retrievedEntity.entryNumber = 911;
    result = await service.save(retrievedEntity);
    
    console.log('\nShould print out the Porsche with updated entry number');
    console.log(JSON.stringify(result, null, 5));
    
    //Delete the Porsche
    result = await service.delete(insertedID);

    //List all cars, we should only have the Ferrari left.
    result = await service.findAll();

    console.log('\nShould print out just the Ferrari');
    console.log(JSON.stringify(result, null, 5));

    //Delete any remaining cars so we have an empty database
    for (let e of result) {
        await service.delete(((e.id as number)));
    }

    //Check that the db is empty
    result = await service.findAll();
    console.log('\nShould print []');
    console.log(JSON.stringify(result, null, 5));    
})();
