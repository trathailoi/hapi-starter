/**
 * The types structure is just a list of symbols for use by Inversify.
 * Each class managed by Inversify will have an entry in this list.
 */
const TYPES = {
    Configue: Symbol.for('Configue'),
    Logger: Symbol.for('Logger'),
    ApiServer: Symbol.for('ApiServer'),
    Controllers: Symbol.for('Controllers'),
    HelloWorldController: Symbol.for('HelloWorldController'),
    CarController: Symbol.for('CarController'),
    CarRepository: Symbol.for('CarRepository'),
    CarService: Symbol.for('CarService')
}

export { TYPES }