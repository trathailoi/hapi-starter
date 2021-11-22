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

}

export { TYPES }