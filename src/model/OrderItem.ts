import { nonNegativeNumber, positiveInteger, uuid } from "../utils/validation.js";

export interface OrderItemRecord {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
}

export interface OrderItemPayload {
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
}

export class OrderItem {
    private constructor(
        private readonly id: string | undefined,
        private readonly orderId: string,
        private readonly productId: string,
        private quantity: number,
        private readonly unitPrice: number,
    ) {}

    static create(input: {
        order_id: unknown;
        product_id: unknown;
        quantity: unknown;
        unit_price: unknown;
    }): OrderItem {
        return new OrderItem(
            undefined,
            uuid(input.order_id, "O identificador do pedido"),
            uuid(input.product_id, "O identificador do produto"),
            positiveInteger(input.quantity, "A quantidade"),
            nonNegativeNumber(input.unit_price, "O preço unitário"),
        );
    }

    static restore(record: OrderItemRecord): OrderItem {
        return new OrderItem(
            record.id,
            record.order_id,
            record.product_id,
            record.quantity,
            Number(record.unit_price),
        );
    }

    changeQuantity(quantity: unknown): void {
        this.quantity = positiveInteger(quantity, "A quantidade");
    }

    getOrderId(): string {
        return this.orderId;
    }

    toPayload(): OrderItemPayload {
        return {
            order_id: this.orderId,
            product_id: this.productId,
            quantity: this.quantity,
            unit_price: this.unitPrice,
        };
    }

    toJSON(): OrderItemPayload & { id?: string } {
        const payload = this.toPayload();
        return this.id === undefined ? payload : { id: this.id, ...payload };
    }
}
