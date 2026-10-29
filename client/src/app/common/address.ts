import { Country, State } from "./state-country";

export class Address {
    street!: string;
    city!: string;
    state!: State;
    country!: Country;
    zipcode!: string;
    constructor(
        street: string,
        city: string,
        state: State,
        country: Country,
        zipcode: string,
    ) {
      this.street = street;
      this.city = city;
      this.state = state;
      this.country = country;
      this.zipcode = zipcode;
    }
}
