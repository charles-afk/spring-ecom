import { afterNextRender, Component, OnInit, signal } from '@angular/core';
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
import { environment } from '../../../environments/environment';
import { PaymentInfo } from '../../common/payment-info';

import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

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

  stripe: Stripe | null = null;
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  clientSecret = signal('');

  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public cartService: CartService,
    public formService: FormService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    afterNextRender(async() => {
      this.paymentInfo.amount = Math.round(this.cartService.totalPrice() * 100);
      this.paymentInfo.currency = "USD";
      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((paymentIntentResponse => this.clientSecret.set(paymentIntentResponse.client_secret)));
      this.stripe = await loadStripe(environment.stripePublishableKey);
      this.setupStripePaymentForm();
    })
   }

  ngOnInit() {
    let email = ''
    if (this.storage.getItem('userEmail') != 'undefined') 
      email = JSON.parse(this.storage.getItem('userEmail')!) || '';
    
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
      })
    });

    this.formService
      .getCountries()
      .subscribe(data => this.countries.set(data));
  };
  
  setupStripePaymentForm() {
    var elements = this.stripe?.elements();
    this.cardElement = elements?.create('card', { hidePostalCode: true });
    this.cardElement.mount('#card-element');
    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
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
    
    const order = new Order(this.cartService.cartItems(), this.cartService.totalPrice(), this.cartService.totalQuantity());
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

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      this.isDisabled = true;
      const data = { 
        payment_method: {
          card: this.cardElement,
          billing_details: {
            email: purchase.customer.email,
            name: `$${purchase.customer.firstName} ${purchase.customer.lastName}`,
            address: {
              line1: purchase.billingAddress.street,
              city: purchase.billingAddress.city,
              state: purchase.billingAddress.state.name,
              postal_code: purchase.billingAddress.zipCode,
              country: purchase.billingAddress.country.code
            }
          }
        } 
      };
      const options = { handleActions: false };
      this.stripe
        ?.confirmCardPayment(this.clientSecret(), data, options)
        .then((result: any) => {
          if (result.error) {
            alert(`There was an error: ${result.error.message}`);
            this.isDisabled = false;
          } else {
            this.checkoutService
              .placeOrder(purchase)
              .subscribe({
                next: response => {
                  alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                  this.resetCart();
                  this.isDisabled = false;
                },
                error: err => {
                  alert(`There was an error: ${err.message}`);
                  this.isDisabled = false;
                }
              });
          }
        });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  };
  
  resetCart() {
    this.cartService.cartItems.set([]);
    this.cartService.totalPrice.set(0);
    this.cartService.totalQuantity.set(0);
    this.cartService.persistCartItems();
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
};