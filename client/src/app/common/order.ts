import { CartItem } from "./cart-item";

export class Order {
    constructor(
        public cartItems: CartItem[],
        public totalPrice: number,
        public totalQuantity: number,
    ) {}
}
