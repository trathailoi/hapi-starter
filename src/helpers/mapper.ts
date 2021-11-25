import 'automapper-ts'
import { injectable } from 'inversify'

import { Address } from '../entity/address'
import { AddressModel } from '../dto/address'

import { Class } from '../entity/class'
import { ClassModel } from '../dto/class'

import { Team } from '../entity/team'
import { TeamModel } from '../dto/team'

/**
 * Wrapper around automapper, for dependency injection convenience (static/global variables bad)
 */
@injectable()
class Mapper {

    /**
     * Helper method, shorthand for 'map all properties of the source to the same properties in
     * the destination'.  This is useful when your model and entity share the same structuer.
     */
    private createDefaultMap(
        fromType: any, 
        toType: any, 
        fields: Array<string>
    ): AutoMapperJs.ICreateMapFluentFunctions 
    {
        const map = automapper.createMap(fromType, toType)
        fields.forEach(key => {
            map.forMember(key, (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom(key))
        })

        return map
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
        ]
    }

    constructor() {
        // Add code here to configure mappings
        this.createDefaultBiDiMap(
            AddressModel, 
            Address,
            ['id', 'name', 'street', 'street2', 'city', 'state', 'zip', 'country']
        )
        this.createDefaultBiDiMap(
            ClassModel, 
            Class,
            ['id', 'name']
        )
        this.createDefaultBiDiMap(
            TeamModel, 
            Team,
            ['id', 'name', 'nationality', 'businessAddress', 'cars']
        )
    }

    public map(source: any, destination: any, value: any): any {
        return automapper.map(source, destination, value)
    }
}

export { Mapper }