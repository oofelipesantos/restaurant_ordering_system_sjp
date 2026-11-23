import { ConflictError, NotFoundError } from "../errors/AppError.js";
import { Order, type OrderRecord } from "../model/Order.js";
import OrderRepository, { type OrderRepositoryContract } from "../repositories/OrderRepository.js";
import { uuid } from "../utils/validation.js";

export type OrderDetails = OrderRecord & { total: number };

export class OrderService {
    constructor(
        private readonly repository: OrderRepositoryContract = OrderRepository,
    ) {}

    async list(): Promise<OrderRecord[]> {
        return this.repository.findAll();
    }

    async getById(id: unknown): Promise<OrderDetails> {
        const order = await this.findRecord(id);
        const total = (order.order_items ?? []).reduce(
            (sum, item) => sum + item.quantity * Number(item.unit_price),
            0,
        );

        return { ...order, total: Number(total.toFixed(2)) };
    }

    async create(): Promise<OrderRecord> {
        return this.repository.create();
    }

    async updateStatus(id: unknown, nextStatus: unknown): Promise<OrderRecord> {
        const orderId = uuid(id, "O identificador do pedido");
        const current = await this.findRecord(orderId);
        const order = Order.restore(current);
        order.changeStatus(nextStatus);

        const updated = await this.repository.update(orderId, order.getStatus());

        if (!updated) {
            throw new NotFoundError("Pedido não encontrado.");
        }

        return updated;
    }

    async remove(id: unknown): Promise<void> {
        const orderId = uuid(id, "O identificador do pedido");
        const current = await this.findRecord(orderId);
        const order = Order.restore(current);

        if (!order.canBeRemoved()) {
            throw new ConflictError("Um pedido entregue não pode ser excluído.");
        }

        if (!(await this.repository.remove(orderId))) {
            throw new NotFoundError("Pedido não encontrado.");
        }
    }

    private async findRecord(id: unknown): Promise<OrderRecord> {
        const order = await this.repository.findById(
            uuid(id, "O identificador do pedido"),
        );

        if (!order) {
            throw new NotFoundError("Pedido não encontrado.");
        }

        return order;
    }
}
