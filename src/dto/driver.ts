export enum Nationality {
    USA = 'USA',
    VietNam = 'Viet Nam'
}
export class DriverModel {
    id?: string
    firstName?: string
    lastName?: string
    nationality?: Nationality
    homeAddress?: string
    managementAddress?: string
    teams?: object[]
    results?: object[]
}