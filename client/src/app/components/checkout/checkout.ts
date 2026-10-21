import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart'
import { Country, State, FormService } from '../../services/form';

@Component({
  selector: 'app-checkout',
  imports: [ ReactiveFormsModule, CurrencyPipe ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  checkoutFormGroup!: FormGroup;
  cardTypes: string[] = ['Debit', 'Visa', 'Mastercard', 'Amex'];
  cardYears: number[] = [];
  cardMonths: number[] = [];
  countries: Country[] = [];
  states: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public cartService: CartService,
    public formService: FormService
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shipping: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipcode: ['']
      }),
      billing: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipcode: ['']
      }),
      card: this.formBuilder.group({
        type: [''],
        name: [''],
        number: [''],
        security: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    this.formService
      .getCardYears()
      .subscribe(data => this.cardYears = data);

    this.formService
      .getCardMonths(new Date().getMonth() + 1)
      .subscribe(data => this.cardMonths = data);

    this.formService
      .getCountries()
      .subscribe(data => this.countries = data);

    this.formService
      .getStates()
      .subscribe(data => this.states = data);
  };

  handleMonthsandYears() {
    const cardFormGroup = this.checkoutFormGroup.get('card');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(cardFormGroup?.value.expirationYear);
    let startMonth: number;
    if (currentYear == selectedYear)
      startMonth = new Date().getMonth() + 1;
    else
      startMonth = 1;
    this.formService.getCardMonths(startMonth).subscribe(data => this.cardMonths = data);
  };

  onSubmit() { 
    console.log(this.checkoutFormGroup);
  };
};
