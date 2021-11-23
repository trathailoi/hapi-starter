/**
 * The types structure is just a list of symbols for use by Inversify.
 * Each class managed by Inversify will have an entry in this list.
 */
const TYPES = {
    Configue: Symbol.for('Configue'),
    Logger: Symbol.for('Logger'),
    Mapper: Symbol.for('Mapper'),
    ApiServer: Symbol.for('ApiServer'),
    Controllers: Symbol.for('Controllers'),
    HelloWorldController: Symbol.for('HelloWorldController'),

    AddressController: Symbol.for('AddressController'),
    AddressRepository: Symbol.for('AddressRepository'),
    AddressService: Symbol.for('AddressService'),
    AddressMapper: Symbol.for('AddressMapper'),

    ClassController: Symbol.for('ClassController'),
    ClassRepository: Symbol.for('ClassRepository'),
    ClassService: Symbol.for('ClassService'),
    ClassMapper: Symbol.for('ClassMapper'),

    TeamController: Symbol.for('TeamController'),
    TeamRepository: Symbol.for('TeamRepository'),
    TeamService: Symbol.for('TeamService'),
    TeamMapper: Symbol.for('TeamMapper'),

    DriverController: Symbol.for('DriverController'),
    DriverRepository: Symbol.for('DriverRepository'),
    DriverService: Symbol.for('DriverService'),
    DriverMapper: Symbol.for('DriverMapper'),

    CarController: Symbol.for('CarController'),
    CarRepository: Symbol.for('CarRepository'),
    CarService: Symbol.for('CarService'),
    CarMapper: Symbol.for('CarMapper'),
    
    RaceController: Symbol.for('RaceController'),
    RaceRepository: Symbol.for('RaceRepository'),
    RaceService: Symbol.for('RaceService'),
    RaceMapper: Symbol.for('RaceMapper'),

    RaceCarController: Symbol.for('RaceCarController'),
    RaceCarRepository: Symbol.for('RaceCarRepository'),
    RaceCarService: Symbol.for('RaceCarService'),
    RaceCarMapper: Symbol.for('RaceCarMapper'),
}

export { TYPES }