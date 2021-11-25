export enum Nationality {
    USA = 'USA',
    VietNam = 'Viet Nam'
}
export class TeamModel {
    id?: string
    name?: string
    nationality?: Nationality
    businessAddress?: string
    cars?: string[]
}