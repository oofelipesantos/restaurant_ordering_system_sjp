import { NotFoundError, ValidationError } from "../errors/AppError.js";
import { Order } from "../model/Order.js";
import { OrderItem, type OrderItemRecord } from "../model/OrderItem.js";
import { Product } from "../model/Product.js";
import OrderItemRepository, { type OrderItemRepositoryContract } from "../repositories/OrderItemRepository.js";
import OrderRepository, { type OrderRepositoryContract } from "../repositories/OrderRepository.js";
import ProductRepository, { type ProductRepositoryContract } from "../repositories/ProductRepository.js";
import { uuid } from "../utils/validation.js";

interface OrderItemInput {
    order_id?: unknown;
    product_id?: unknown;
    quantity?: unknown;
}

function asInput(value: unknown): OrderItemInput {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new ValidationError("Os dados do item do pedido são inválidos.");
    }

    return value as OrderItemInput;
}

export class OrderItemService {
    constructor(
        private readonly repository: OrderItemRepositoryContract = OrderItemRepository,
        private readonly orderRepository: OrderRepositoryContract = OrderRepository,
        private readonly productRepository: ProductRepositoryContract = ProductRepository,
    ) {}

    async list(orderId?: unknown): Promise<OrderItemRecord[]> {
        if (orderId === undefined) {
            return this.repository.findAll();
        }

        return this.repository.findAll(
            uuid(orderId, "O identificador do pedido"),
        );
    }

    async getById(id: unknown): Promise<OrderItemRecord> {
        const item = await this.repository.findById(
            uuid(id, "O identificador do item"),
        );

        if (!item) {
            throw new NotFoundError("Item do pedido não encontrado.");
        }

        return item;
    }

    async create(value: unknown): Promise<OrderItemRecord> {
        const input = asInput(value);
        const orderId = uuid(input.order_id, "O identificador do pedido");
        const productId = uuid(input.product_id, "O identificador do produto");
        await this.ensurePendingOrder(orderId);

        const productRecord = await this.productRepository.findById(productId);
        if (!productRecord) {
            throw new NotFoundError("Produto não encontrado.");
        }

        const product = Product.restore(productRecord);
        if (!product.isActive() || !product.isAvailable()) {
            throw new ValidationError("O produto está inativo ou indisponível.");
        }

        const item = OrderItem.create({
            order_id: orderId,
            product_id: productId,
            quantity: input.quantity,
            unit_price: productRecord.price,
        });

        return this.repository.create(item.toPayload());
    }

    async update(id: unknown, value: unknown): Promise<OrderItemRecord> {
        const itemId = uuid(id, "O identificador do item");
        const input = asInput(value);
        const current = await this.getById(itemId);
        const item = OrderItem.restore(current);
        await this.ensurePendingOrder(item.getOrderId());
        item.changeQuantity(input.quantity);

        const updated = await this.repository.update(
            itemId,
            item.toPayload().quantity,
        );

        if (!updated) {
            throw new NotFoundError("Item do pedido não encontrado.");
        }

        return updated;
    }

    async remove(id: unknown): Promise<void> {
        const itemId = uuid(id, "O identificador do item");
        const item = await this.getById(itemId);
        await this.ensurePendingOrder(item.order_id);

        if (!(await this.repository.remove(itemId))) {
            throw new NotFoundError("Item do pedido não encontrado.");
        }
    }

    private async ensurePendingOrder(orderId: string): Promise<void> {
        const record = await this.orderRepository.findById(orderId);

        if (!record) {
            throw new NotFoundError("Pedido não encontrado.");
        }

        if (!Order.restore(record).canReceiveItems()) {
            throw new ValidationError(
                "Itens só podem ser alterados enquanto o pedido estiver pendente.",
            );
        }
    }
}
