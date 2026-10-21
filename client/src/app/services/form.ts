import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Country, State } from '../common/state-country';

export interface GetResponseCountry {
  _embedded: {
    countries: Country[]
  }
};

export interface GetResponseState {
  _embedded: {
    states: State[]
  }
}

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private countriesUrl = "http://localhost:8080/api/countries";
  private statesUrl = "http://localhost:8080/api/states";

  constructor(private httpClient: HttpClient) { };

  getCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];
    for (let month = startMonth; month <= 12; month++)
      data.push(month);
    return of(data);
  };

  getCardYears(): Observable<number[]>{
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let year = startYear; year <= endYear; year++)
      data.push(year);
    return of(data);
  };

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountry>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  };

  getCountryById(countryId: number): Observable<Country> {
    return this.httpClient.get<Country>(`${this.countriesUrl}/${countryId}`);
  }

  getStates(): Observable<State[]> {
    return this.httpClient.get<GetResponseState>(this.statesUrl).pipe(
      map(response => response._embedded.states)
    );
  };

  getStatesByCountryCode(code: string): Observable<State[]> {
    return this.httpClient.get<GetResponseState>(`${this.statesUrl}/search/findByCountryCode?code=${code}`).pipe(
      map(response => response._embedded.states)
    );
  }
};