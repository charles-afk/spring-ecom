import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';
import { CartDetails } from './components/cart-details/cart-details';
import { Checkout } from './components/checkout/checkout';
import { MembersPage } from './components/members-page/members-page';
import { AuthGuard } from '@auth0/auth0-angular';
import { OrderHistory } from './components/order-history/order-history';

export const routes: Routes = [
    { path: 'search/:keyword', component: ProductList },
    { path: 'category/:id', component: ProductList },
    { path: 'category', component: ProductList },
    { path: 'products', component: ProductList },
    { path: 'products/:id', component: ProductDetails },
    { path: 'cart-details', component: CartDetails },
    { path: 'checkout', component: Checkout },
    { path: 'members', component: MembersPage, canActivate: [AuthGuard] },
    { path: 'order-history', component: OrderHistory, canActivate: [AuthGuard]},
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', redirectTo: '/products', pathMatch: 'full' }
];