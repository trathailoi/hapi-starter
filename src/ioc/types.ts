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

    ClassRepository: Symbol.for('ClassRepository'),
    ClassService: Symbol.for('ClassService'),
    ClassController: Symbol.for('ClassController'),

    AddressRepository: Symbol.for('AddressRepository'),
    AddressService: Symbol.for('AddressService'),
    AddressController: Symbol.for('AddressController'),

    TeamRepository: Symbol.for('TeamRepository'),
    TeamService: Symbol.for('TeamService'),
    TeamController: Symbol.for('TeamController'),

    DriverRepository: Symbol.for('DriverRepository'),
    DriverService: Symbol.for('DriverService'),
    DriverController: Symbol.for('DriverController'),

    CarRepository: Symbol.for('CarRepository'),
    CarService: Symbol.for('CarService'),
    CarController: Symbol.for('CarController'),

    RaceRepository: Symbol.for('RaceRepository'),
    RaceService: Symbol.for('RaceService'),
    RaceController: Symbol.for('RaceController'),

    RaceResultRepository: Symbol.for('RaceResultRepository'),
    RaceResultService: Symbol.for('RaceResultService'),
    RaceResultController: Symbol.for('RaceResultController'),

}

export { TYPES }