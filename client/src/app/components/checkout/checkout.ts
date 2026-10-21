import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart'
import { FormService } from '../../services/form';
import { Country, State } from '../../common/state-country';

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
  countries =  signal<Country[]>([new Country(0, '', '')]);
  shippingStates =  signal<State[]>([new State(0, '')]);
  billingStates =  signal<State[]>([new State(0, '')]);

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
      .subscribe(data => this.countries.set(data));
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

    this.formService
      .getCardMonths(startMonth)
      .subscribe(data => this.cardMonths = data);
  };

  handleStates(formType: string) {
    const formGroup = this.checkoutFormGroup.get(formType);
    const selectedCountryCode: string = formGroup?.value.country.code;

    this.formService
      .getStatesByCountryCode(selectedCountryCode)
      .subscribe(data => {
        formType === 'shipping' ? 
          this.shippingStates.set(data) : 
          this.billingStates.set(data);
        formGroup?.get('state')?.setValue(data[0].name);
      });
  };

  copyShippingAddressToBillingAddress(event: Event) {
    const target = event.target as HTMLInputElement; 
    if (target.checked) {
      this.checkoutFormGroup.controls['billing'].setValue(this.checkoutFormGroup.controls['shipping'].value);
      this.billingStates.set(this.shippingStates());
    } else {
      this.checkoutFormGroup.controls['billing'].reset();
      this.billingStates.set([]);
    }
  }

  onSubmit() { 
    console.log(this.checkoutFormGroup);
  };
};
