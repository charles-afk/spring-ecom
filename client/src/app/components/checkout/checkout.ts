import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart'
import { FormService } from '../../services/form';
import { Country, State } from '../../common/state-country';
import { CustomValidators } from '../../validators/custom-validators';

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
    public formService: FormService,
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), CustomValidators.notOnlyWhitespace]),
      }),
      shipping: this.formBuilder.group({
        country: new FormControl('', [Validators.required, CustomValidators.notOnlyWhitespace]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required, CustomValidators.notOnlyWhitespace]),
        zipcode: new FormControl('', [Validators.required, Validators.minLength(5), CustomValidators.notOnlyWhitespace]),
      }),
      billing: this.formBuilder.group({
        country: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        zipcode: new FormControl('', [Validators.required, Validators.minLength(5), CustomValidators.notOnlyWhitespace]),
      }),
      card: this.formBuilder.group({
        type: new FormControl('', [Validators.required, CustomValidators.notOnlyWhitespace]),
        name: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        number: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}'), CustomValidators.notOnlyWhitespace]),
        security: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required, CustomValidators.notOnlyWhitespace]),
        expirationYear: new FormControl('', [Validators.required, CustomValidators.notOnlyWhitespace]),
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

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  };

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  };

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  };

  get shippingCountry() {
    return this.checkoutFormGroup.get('shipping.country');
  };

  get shippingStreet() {
    return this.checkoutFormGroup.get('shipping.street');
  };

  get shippingCity() {
    return this.checkoutFormGroup.get('shipping.city');
  };

  get shippingState() {
    return this.checkoutFormGroup.get('shipping.state');
  };

  get shippingZipcode() {
    return this.checkoutFormGroup.get('shipping.zipcode');
  };

  get billingCountry() {
    return this.checkoutFormGroup.get('billing.country');
  };

  get billingStreet() {
    return this.checkoutFormGroup.get('billing.street');
  };

  get billingCity() {
    return this.checkoutFormGroup.get('billing.city');
  };

  get billingState() {
    return this.checkoutFormGroup.get('billing.state');
  };

  get billingZipcode() {
    return this.checkoutFormGroup.get('billing.zipcode');
  };

  get type() {
    return this.checkoutFormGroup.get('card.type');
  }

  get cardName() {
    return this.checkoutFormGroup.get('card.name');
  }

  get number() {
    return this.checkoutFormGroup.get('card.number');
  }

  get security() {
    return this.checkoutFormGroup.get('card.security');
  }

  get expMonth() {
    return this.checkoutFormGroup.get('card.expirationMonth');
  }

  get expYear() {
    return this.checkoutFormGroup.get('card.expirationYear');
  }

  onSubmit() { 
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup);
  };
};
