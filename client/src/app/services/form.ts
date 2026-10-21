import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Country {
  id: number;
  code: string;
  name: string;
};

export interface State {
  id: number;
  code: string;
  name: string;
};

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
    return this.httpClient.get<Country[]>(this.countriesUrl);
  };

  getCountryById(countryId: number): Observable<Country> {
    return this.httpClient.get<Country>(`${this.countriesUrl}/${countryId}`);
  }

  getStates(): Observable<State[]> {
    return this.httpClient.get<State[]>(this.statesUrl);
  };

  getStatesByCountryCode(code: string): Observable<State[]> {
    return this.httpClient.get<State[]>(`${this.statesUrl}/search/findByCountryCode?code=${code}`);
  }
};