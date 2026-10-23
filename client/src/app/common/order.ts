import { CartItem } from "./cart-item";

export class Order {
    constructor(
        public cartItems: CartItem[],
        public total: number,
        public totalQuantity: number,
    ) {}
}
