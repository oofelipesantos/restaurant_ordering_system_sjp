import { randomUUID } from "node:crypto";
import type { CategoryPayload, CategoryRecord } from "../../model/Category.js";
import type { OrderItemPayload, OrderItemRecord } from "../../model/OrderItem.js";
import type { OrderRecord, OrderStatus } from "../../model/Order.js";
import type { ProductPayload, ProductRecord } from "../../model/Product.js";
import type { CategoryRepositoryContract } from "../../repositories/CategoryRepository.js";
import type { OrderItemRepositoryContract } from "../../repositories/OrderItemRepository.js";
import type { OrderRepositoryContract } from "../../repositories/OrderRepository.js";
import type { ProductRepositoryContract } from "../../repositories/ProductRepository.js";

function copy<T>(value: T): T {
    return structuredClone(value);
}

export class MemoryDatabase {
    readonly categories = new Map<string, CategoryRecord>();
    readonly products = new Map<string, ProductRecord>();
    readonly orders = new Map<string, OrderRecord>();
    readonly orderItems = new Map<string, OrderItemRecord>();
}

export class InMemoryCategoryRepository
implements CategoryRepositoryContract {
    constructor(private readonly database: MemoryDatabase) {}

    async findAll(): Promise<CategoryRecord[]> {
        return [...this.database.categories.values()]
            .sort((a, b) => a.display_order - b.display_order)
            .map(copy);
    }

    async findById(id: string): Promise<CategoryRecord | null> {
        const category = this.database.categories.get(id);
        return category ? copy(category) : null;
    }

    async findByName(
        name: string,
        excludeId?: string,
    ): Promise<CategoryRecord | null> {
        const normalized = name.toLocaleLowerCase();
        const category = [...this.database.categories.values()].find(
            (item) =>
                item.id !== excludeId &&
                item.name.toLocaleLowerCase() === normalized,
        );
        return category ? copy(category) : null;
    }

    async searchByKeyword(keyword: string): Promise<CategoryRecord[]> {
        const normalized = keyword.toLocaleLowerCase();
        return [...this.database.categories.values()]
            .filter(
                (item) =>
                    item.name.toLocaleLowerCase().includes(normalized) ||
                    item.description?.toLocaleLowerCase().includes(normalized),
            )
            .map(copy);
    }

    async create(payload: CategoryPayload): Promise<CategoryRecord> {
        const category = { id: randomUUID(), ...payload };
        this.database.categories.set(category.id, category);
        return copy(category);
    }

    async update(
        id: string,
        payload: CategoryPayload,
    ): Promise<CategoryRecord | null> {
        if (!this.database.categories.has(id)) {
            return null;
        }
        const category = { id, ...payload };
        this.database.categories.set(id, category);
        return copy(category);
    }

    async remove(id: string): Promise<boolean> {
        const hasProducts = [...this.database.products.values()].some(
            (product) => product.category_id === id,
        );
        if (hasProducts) {
            return false;
        }
        return this.database.categories.delete(id);
    }
}

export class InMemoryProductRepository
implements ProductRepositoryContract {
    constructor(private readonly database: MemoryDatabase) {}

    async findAll(): Promise<ProductRecord[]> {
        return [...this.database.products.values()]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(copy);
    }

    async findById(id: string): Promise<ProductRecord | null> {
        const product = this.database.products.get(id);
        return product ? copy(product) : null;
    }

    async searchByKeyword(keyword: string): Promise<ProductRecord[]> {
        const normalized = keyword.toLocaleLowerCase();
        return [...this.database.products.values()]
            .filter(
                (item) =>
                    item.title.toLocaleLowerCase().includes(normalized) ||
                    item.description?.toLocaleLowerCase().includes(normalized),
            )
            .map(copy);
    }

    async create(payload: ProductPayload): Promise<ProductRecord> {
        const product = { id: randomUUID(), ...payload };
        this.database.products.set(product.id, product);
        return copy(product);
    }

    async update(
        id: string,
        payload: ProductPayload,
    ): Promise<ProductRecord | null> {
        if (!this.database.products.has(id)) {
            return null;
        }
        const product = { id, ...payload };
        this.database.products.set(id, product);
        return copy(product);
    }

    async remove(id: string): Promise<boolean> {
        const isUsed = [...this.database.orderItems.values()].some(
            (item) => item.product_id === id,
        );
        if (isUsed) {
            return false;
        }
        return this.database.products.delete(id);
    }
}

export class InMemoryOrderRepository implements OrderRepositoryContract {
    constructor(private readonly database: MemoryDatabase) {}

    async findAll(): Promise<OrderRecord[]> {
        return [...this.database.orders.values()].map(copy);
    }

    async findById(id: string): Promise<OrderRecord | null> {
        const order = this.database.orders.get(id);
        if (!order) {
            return null;
        }
        const orderItems = [...this.database.orderItems.values()]
            .filter((item) => item.order_id === id)
            .map(({ id: itemId, product_id, quantity, unit_price }) => ({
                id: itemId,
                product_id,
                quantity,
                unit_price,
            }));
        return copy({ ...order, order_items: orderItems });
    }

    async create(): Promise<OrderRecord> {
        const order: OrderRecord = {
            id: randomUUID(),
            status: "pending",
            created_at: new Date().toISOString(),
        };
        this.database.orders.set(order.id, order);
        return copy(order);
    }

    async update(id: string, status: OrderStatus): Promise<OrderRecord | null> {
        const current = this.database.orders.get(id);
        if (!current) {
            return null;
        }
        const order = { ...current, status };
        this.database.orders.set(id, order);
        return copy(order);
    }

    async remove(id: string): Promise<boolean> {
        if (!this.database.orders.delete(id)) {
            return false;
        }
        for (const [itemId, item] of this.database.orderItems) {
            if (item.order_id === id) {
                this.database.orderItems.delete(itemId);
            }
        }
        return true;
    }
}

export class InMemoryOrderItemRepository
implements OrderItemRepositoryContract {
    constructor(private readonly database: MemoryDatabase) {}

    async findAll(orderId?: string): Promise<OrderItemRecord[]> {
        return [...this.database.orderItems.values()]
            .filter((item) => orderId === undefined || item.order_id === orderId)
            .map(copy);
    }

    async findById(id: string): Promise<OrderItemRecord | null> {
        const item = this.database.orderItems.get(id);
        return item ? copy(item) : null;
    }

    async create(payload: OrderItemPayload): Promise<OrderItemRecord> {
        const item = { id: randomUUID(), ...payload };
        this.database.orderItems.set(item.id, item);
        return copy(item);
    }

    async update(
        id: string,
        quantity: number,
    ): Promise<OrderItemRecord | null> {
        const current = this.database.orderItems.get(id);
        if (!current) {
            return null;
        }
        const item = { ...current, quantity };
        this.database.orderItems.set(id, item);
        return copy(item);
    }

    async remove(id: string): Promise<boolean> {
        return this.database.orderItems.delete(id);
    }
}

export function createMemoryRepositories(database = new MemoryDatabase()) {
    return {
        database,
        categoryRepository: new InMemoryCategoryRepository(database),
        productRepository: new InMemoryProductRepository(database),
        orderRepository: new InMemoryOrderRepository(database),
        orderItemRepository: new InMemoryOrderItemRepository(database),
    };
}
