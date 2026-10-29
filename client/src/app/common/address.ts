import { Country, State } from "./state-country";

export class Address {
    street!: string;
    city!: string;
    state!: State;
    country!: Country;
    zipCode!: string;
    constructor(
        street: string,
        city: string,
        state: State,
        country: Country,
        zipCode: string,
    ) {
      this.street = street;
      this.city = city;
      this.state = state;
      this.country = country;
      this.zipCode = zipCode;
    }
}
