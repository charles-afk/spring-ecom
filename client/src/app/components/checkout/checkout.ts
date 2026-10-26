import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart'
import { FormService } from '../../services/form';
import { CheckoutService } from '../../services/checkout';
import { CustomValidators } from '../../validators/custom-validators';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { Customer } from '../../common/customer';
import { Address } from '../../common/address';
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
  storage: Storage = localStorage;

  constructor(
    private formBuilder: FormBuilder,
    public cartService: CartService,
    public formService: FormService,
    private checkoutService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const email = JSON.parse(this.storage.getItem('userEmail')!) || '';
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        email: new FormControl(email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), CustomValidators.notOnlyWhitespace]),
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
        formGroup?.get('state')?.setValue(data[0]);
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
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    const customerForm = this.checkoutFormGroup.controls['customer'].value;
    const shippingForm = this.checkoutFormGroup.controls['shipping'].value;
    const billingForm = this.checkoutFormGroup.controls['billing'].value;
    
    const order = new Order(this.cartService.cartItems(), this.cartService.total(), this.cartService.totalQuantity());
    const shippingState = new State(shippingForm.state.id, shippingForm.state.name);
    const shippingCountry = new Country(shippingForm.country.id, shippingForm.country.name, shippingForm.country.code);
    const billingState = new State(billingForm.state.id, billingForm.state.name);
    const billingCountry = new Country(billingForm.country.id, billingForm.country.name, billingForm.country.code);

    const purchase = new Purchase(
      new Customer(customerForm.firstName, customerForm.lastName, customerForm.email), 
      new Address(shippingForm.street, shippingForm.city, shippingState, shippingCountry, shippingForm.zipCode), 
      new Address(billingForm.street, billingForm.city, billingState, billingCountry, billingForm.zipCode), 
      order, order.cartItems.map(cartItem => new OrderItem(cartItem))
    );
    
    this.checkoutService
      .placeOrder(purchase)
      .subscribe({
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          this.resetCart();
        },
        error: err => alert(`There was an error: ${err.message}`) 
      });
  };
  
  resetCart() {
    this.cartService.cartItems.set([]);
    this.cartService.total.set(0);
    this.cartService.totalQuantity.set(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  };

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
  };

  get cardName() {
    return this.checkoutFormGroup.get('card.name');
  };

  get number() {
    return this.checkoutFormGroup.get('card.number');
  };

  get security() {
    return this.checkoutFormGroup.get('card.security');
  };

  get expMonth() {
    return this.checkoutFormGroup.get('card.expirationMonth');
  };

  get expYear() {
    return this.checkoutFormGroup.get('card.expirationYear');
  };
};