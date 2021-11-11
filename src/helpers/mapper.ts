import 'automapper-ts';
import { injectable } from 'inversify';
import { Car } from '../entity/car';
import { CarModel } from '../model/car';
/**
 * Wrapper around automapper, for dependency injection convenience (static/global variables bad)
 */
@injectable()
class Mapper {

    /**
     * Helper method, shorthand for "map all properties of the source to the same properties in
     * the destination".  This is useful when your model and entity share the same structuer.
     */
    private createDefaultMap(
        fromType: any, 
        toType: any, 
        fields: Array<string>
    ): AutoMapperJs.ICreateMapFluentFunctions 
    {
        const map = automapper.createMap(fromType, toType);
        fields.forEach(key => {
            map.forMember(key, (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom(key));
        });

        return map;
    }

    /** 
     * Helper method, creates mappings between two types in both directions 
     */
    private createDefaultBiDiMap(
        typeA: any, 
        typeB: any,
        fields: Array<string>
    ): Array<AutoMapperJs.ICreateMapFluentFunctions> 
    {
        return [
            this.createDefaultMap(typeA, typeB, fields),
            this.createDefaultMap(typeB, typeA, fields)
        ];
    }

    constructor() {
        this.createDefaultBiDiMap(
            CarModel, 
            Car, 
            ['id', 'make', 'model', 'color', 'entryNumber']
        );
    }

    public map(source: any, destination: any, value: any): any {
        return automapper.map(source, destination, value);
    }
}

export { Mapper }