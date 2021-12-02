import { Repository } from 'typeorm'
import { container } from '../src/ioc/ioc'
import { TYPES } from '../src/ioc/types'
import { initializeDatabase } from '../src/helpers/database'

import { Address } from '../src/entity/address'
import { Car } from '../src/entity/car'
import { Class } from '../src/entity/class'
import { Driver } from '../src/entity/driver'
import { Race } from '../src/entity/race'
import { Team } from '../src/entity/team'
import { RaceResult } from '../src/entity/race-result'

// TODO: using Faker for random meaningful values

(async () => {
    const Configue = require('configue')
    await initializeDatabase(await container.get<typeof Configue>(TYPES.Configue))

    const classRepository = await container.get<Repository<Class>>(TYPES.ClassRepository)
    const addressRepository = await container.get<Repository<Address>>(TYPES.AddressRepository)
    const driverRepository = await container.get<Repository<Driver>>(TYPES.DriverRepository)
    const teamRepository = await container.get<Repository<Team>>(TYPES.TeamRepository)
    const carRepository = await container.get<Repository<Car>>(TYPES.CarRepository)
    const raceRepository = await container.get<Repository<Race>>(TYPES.RaceRepository)
    const raceResultRepository = await container.get<Repository<RaceResult>>(TYPES.RaceResultRepository)

    /**
     * Class
     */
    const _classes: Class[] = [
        {
            name: 'tự chế, tự độ',
            // results: [] as RaceResult[]
        } as Class,
        {
            name: 'trộm chó',
            // results: [] as RaceResult[]
        } as Class,
        {
            name: 'giựt dây chuyền',
            // results: [] as RaceResult[]
        } as Class,
        {
            name: 'dành tổ lái',
            // results: [] as RaceResult[]
        } as Class
    ]
    const classesResp = await classRepository.save(_classes)
    console.log('classesResp', classesResp)

    /**
     * Address
     */
    const addresses: Address[] = [
        {
            name: 'câu lạc bộ tổ lái',
            street: '123 Nguyễn Văn Cừ',
            street2: '123 Nguyễn Văn Cừ',
            city: 'Nha Trang',
            state: 'Khánh Hòa',
            zip: '12345',
            country: 'Việt Nam'
        } as Address,
        {
            name: 'chung cư Napoleon',
            street: '25-26 Nguyễn Đình Chiểu',
            street2: '',
            city: 'Nha Trang',
            state: 'Khánh Hòa',
            zip: '65000',
            country: 'Việt Nam'
        } as Address,
        {
            name: 'Mường Thanh Viễn Triều',
            street: 'số 5 Phạm Văn Đồng',
            street2: '',
            city: 'Nha Trang',
            state: 'Khánh Hòa',
            zip: '65000',
            country: 'Việt Nam'
        } as Address
    ]
    const addressesResp = await addressRepository.save(addresses)
    console.log('addressesResp', addressesResp)

    /**
     * Driver
     */
    const drivers: Driver[] = [
        {
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            nationality: 'USA',
            homeAddress: addressesResp[0],
            managementAddress: addressesResp[0],
            // teams: Team[],
            // results: RaceResult[]
        } as Driver,
        {
            firstName: 'Tommy',
            lastName: 'Tèo',
            nationality: 'Viet Nam',
            homeAddress: addressesResp[1],
            managementAddress: addressesResp[1],
            // teams: Team[],
            // results: RaceResult[]
        } as Driver,
        {
            firstName: 'Johnny',
            lastName: 'Tí',
            nationality: 'USA',
            homeAddress: addressesResp[0],
            managementAddress: addressesResp[0],
            // teams: Team[],
            // results: RaceResult[]
        } as Driver
    ]
    const driversResp = await driverRepository.save(drivers)
    console.log('driversResp', driversResp)

    /**
     * Car
     */
    const cars: Car[] = [
        {
            name: 'Exciter',
            make: 'Yamaha',
            model: '150cc',
            class: classesResp[1],
            // team: 'string',
            // results?: RaceResult[]
        } as Car,
        {
            name: 'Exciter Hồng',
            make: 'Yamaha',
            model: '150cc',
            class: classesResp[1],
            // team: 'string',
            // results?: RaceResult[]
        } as Car,
        {
            name: 'Winner',
            make: 'Honda',
            model: '150cc',
            class: classesResp[2],
            // team: 'string',
            // results?: RaceResult[]
        } as Car,
        {
            name: 'Winner Tím',
            make: 'Honda',
            model: '150cc',
            class: classesResp[2],
            // team: 'string',
            // results?: RaceResult[]
        } as Car,
        {
            name: 'Lead',
            make: 'Honda',
            model: 'Ninja',
            class: classesResp[0],
            // team: 'string',
            // results?: RaceResult[]
        } as Car
    ]
    const carsResp = await carRepository.save(cars)
    console.log('carsResp', carsResp)

    /**
     * Team
     */
    const teams: Team[] = [
        {
            name: 'Team A',
            nationality: 'USA',
            businessAddress: addressesResp[0],
            cars: carsResp,
            drivers: driversResp,
            // results: RaceResult[]
        } as Team,
        {
            name: 'Team B',
            nationality: 'Viet Nam',
            businessAddress: addressesResp[2],
            cars: carsResp,
            drivers: driversResp,
            // results: RaceResult[]
        } as Team,
    ]
    const teamsResp = await teamRepository.save(teams)
    console.log('teamsResp', teamsResp)

    /**
     * Race
     */
    const races: Race[] = [
        {
            name: 'cuộc đua kỳ thú'
        } as Race,
        {
            name: 'bát hương vàng'
        } as Race,
        {
            name: 'nải chuối xanh mở rộng'
        } as Race
    ]
    const racesResp = await raceRepository.save(races)
    console.log('racesResp', racesResp)

    /**
     * Race Result
     */
    const raceResults: RaceResult[] = [
        {
            car: carsResp[0],
            carNumber: 1,
            race: racesResp[0],
            driver: driversResp[0],
            class: classesResp[0],
            startingPosition: 12
            // finishingPosition: 2,
            // isFinished: false
        } as RaceResult,
        {
            car: carsResp[1],
            carNumber: 2,
            race: racesResp[0],
            driver: driversResp[1],
            class: classesResp[0],
            startingPosition: 11,
            finishingPosition: 2,
            isFinished: true
        } as RaceResult,
        {
            car: carsResp[3],
            carNumber: 3,
            race: racesResp[1],
            driver: driversResp[0],
            class: classesResp[1],
            startingPosition: 10,
            finishingPosition: 4,
            isFinished: true
        } as RaceResult,
        {
            car: carsResp[4],
            carNumber: 4,
            race: racesResp[1],
            driver: driversResp[0],
            class: classesResp[2],
            startingPosition: 10,
            finishingPosition: 4,
            isFinished: true
        } as RaceResult
    ]
    const raceResultsResp = await raceResultRepository.save(raceResults)
    console.log('raceResultsResp', raceResultsResp)

    process.exit(0)
})()