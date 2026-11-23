import { ValidationError } from "../errors/AppError.js";

export const ORDER_STATUSES = [
    "pending",
    "preparing",
    "ready",
    "delivered",
    "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItemSummary {
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
}

export interface OrderRecord {
    id: string;
    status: OrderStatus;
    created_at: string;
    order_items?: OrderItemSummary[];
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
    pending: ["preparing", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["delivered"],
    delivered: [],
    cancelled: [],
};

export class Order {
    private constructor(
        private readonly id: string | undefined,
        private status: OrderStatus,
        private readonly createdAt: string | undefined,
    ) {}

    static create(): Order {
        return new Order(undefined, "pending", undefined);
    }

    static restore(record: OrderRecord): Order {
        return new Order(record.id, record.status, record.created_at);
    }

    changeStatus(nextStatus: unknown): void {
        if (
            typeof nextStatus !== "string" ||
            !ORDER_STATUSES.includes(nextStatus as OrderStatus)
        ) {
            throw new ValidationError("Status do pedido inválido.");
        }

        if (!ALLOWED_TRANSITIONS[this.status].includes(nextStatus as OrderStatus)) {
            throw new ValidationError(
                `Não é permitido alterar o pedido de ${this.status} para ${nextStatus}.`,
            );
        }

        this.status = nextStatus as OrderStatus;
    }

    canReceiveItems(): boolean {
        return this.status === "pending";
    }

    canBeRemoved(): boolean {
        return this.status !== "delivered";
    }

    getStatus(): OrderStatus {
        return this.status;
    }

    toJSON(): { id?: string; status: OrderStatus; created_at?: string } {
        return {
            ...(this.id === undefined ? {} : { id: this.id }),
            status: this.status,
            ...(this.createdAt === undefined ? {} : { created_at: this.createdAt }),
        };
    }
}
