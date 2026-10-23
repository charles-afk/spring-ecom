import { Country, State } from "./state-country";

export class Address {
    constructor(
        street: string,
        city: string,
        state: State,
        country: Country,
        zipCode: string,
    ) {}
}
