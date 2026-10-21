import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [ ReactiveFormsModule, CurrencyPipe ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  checkoutFormGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public cartService: CartService
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
  };

  onSubmit() { 
    console.log(this.checkoutFormGroup);
  };
};
