import 'automapper-ts'
import { injectable } from 'inversify'

import { Address } from '../entity/address'
import { AddressModel } from '../dto/address'

import { Class } from '../entity/class'
import { ClassModel } from '../dto/class'

import { Team } from '../entity/team'
import { TeamModel } from '../dto/team'

import { Driver } from '../entity/driver'
import { DriverModel } from '../dto/driver'

import { Car } from '../entity/car'
import { CarModel } from '../dto/car'

import { Race } from '../entity/race'
import { RaceModel } from '../dto/race'

import { RaceResult } from '../entity/race-result'
import { RaceResultModel } from '../dto/race-result'

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
        this.createDefaultBiDiMap(
            DriverModel, 
            Driver,
            ['id', 'firstName', 'lastName', 'nationality', 'homeAddress', 'managementAddress', 'teams', 'results']
        )
        this.createDefaultBiDiMap(
            CarModel, 
            Car,
            ['id', 'name', 'make', 'model', 'class', 'team', 'results']
        )
        this.createDefaultBiDiMap(
            RaceModel, 
            Race,
            ['id', 'name', 'results']
        )
        this.createDefaultBiDiMap(
            RaceResultModel, 
            RaceResult,
            ['id', 'car', 'carNumber', 'race', 'driver', 'class', 'startingPosition', 'finishingPosition', 'isFinished']
        )
    }

    public map(source: any, destination: any, value: any): any {
        return automapper.map(source, destination, value)
    }
}

export { Mapper }