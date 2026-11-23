import { describe, expect, it } from "vitest";
import { CategoryService } from "../../services/CategoryService.js";
import { OrderItemService } from "../../services/OrderItemService.js";
import { OrderService } from "../../services/OrderService.js";
import { ProductService } from "../../services/ProductService.js";
import { createMemoryRepositories } from "../helpers/inMemoryRepositories.js";

function createServices() {
    const repositories = createMemoryRepositories();
    return {
        ...repositories,
        categoryService: new CategoryService(repositories.categoryRepository),
        productService: new ProductService(
            repositories.productRepository,
            repositories.categoryRepository,
        ),
        orderService: new OrderService(repositories.orderRepository),
        orderItemService: new OrderItemService(
            repositories.orderItemRepository,
            repositories.orderRepository,
            repositories.productRepository,
        ),
    };
}

describe("Services e regras de negócio", () => {
    it("impede categorias duplicadas e atualizações vazias", async () => {
        const { categoryService } = createServices();
        const category = await categoryService.create({
            name: "Bebidas",
            display_order: 1,
        });

        await expect(
            categoryService.create({ name: "bebidas", display_order: 2 }),
        ).rejects.toThrow("Já existe");
        await expect(categoryService.update(category.id, {})).rejects.toThrow(
            "ao menos um campo",
        );
    });

    it("exige categoria existente e ativa para cadastrar produto", async () => {
        const { categoryService, productService } = createServices();

        await expect(
            productService.create({
                category_id: "550e8400-e29b-41d4-a716-446655440000",
                title: "Pizza",
                price: 10,
            }),
        ).rejects.toThrow("não encontrada");

        const category = await categoryService.create({
            name: "Pizzas",
            display_order: 1,
        });
        await categoryService.update(category.id, { active: false });

        await expect(
            productService.create({
                category_id: category.id,
                title: "Pizza",
                price: 10,
            }),
        ).rejects.toThrow("categoria inativa");
    });

    it("calcula total do pedido e valida o fluxo dos itens", async () => {
        const {
            categoryService,
            productService,
            orderService,
            orderItemService,
        } = createServices();
        const category = await categoryService.create({
            name: "Pizzas",
            display_order: 1,
        });
        const product = await productService.create({
            category_id: category.id,
            title: "Margherita",
            price: 20,
        });
        const order = await orderService.create();
        const item = await orderItemService.create({
            order_id: order.id,
            product_id: product.id,
            quantity: 2,
        });

        expect((await orderService.getById(order.id)).total).toBe(40);
        await orderService.updateStatus(order.id, "preparing");
        await expect(
            orderItemService.update(item.id, { quantity: 3 }),
        ).rejects.toThrow("pedido estiver pendente");
        await expect(orderItemService.remove(item.id)).rejects.toThrow(
            "pedido estiver pendente",
        );
    });

    it("retorna erros coerentes para registros inexistentes", async () => {
        const { categoryService, productService, orderService, orderItemService } =
            createServices();
        const id = "550e8400-e29b-41d4-a716-446655440000";

        await expect(categoryService.getById(id)).rejects.toThrow("não encontrada");
        await expect(productService.getById(id)).rejects.toThrow("não encontrado");
        await expect(orderService.getById(id)).rejects.toThrow("não encontrado");
        await expect(orderItemService.getById(id)).rejects.toThrow("não encontrado");
    });
});
