import { createApp } from "../../app.js";
import { CategoryService } from "../../services/CategoryService.js";
import { OrderItemService } from "../../services/OrderItemService.js";
import { OrderService } from "../../services/OrderService.js";
import { ProductService } from "../../services/ProductService.js";
import { createMemoryRepositories } from "./inMemoryRepositories.js";

export function createTestContext() {
    const repositories = createMemoryRepositories();
    const categoryService = new CategoryService(repositories.categoryRepository);
    const productService = new ProductService(
        repositories.productRepository,
        repositories.categoryRepository,
    );
    const orderService = new OrderService(repositories.orderRepository);
    const orderItemService = new OrderItemService(
        repositories.orderItemRepository,
        repositories.orderRepository,
        repositories.productRepository,
    );
    const app = createApp({
        categoryService,
        productService,
        orderService,
        orderItemService,
    });

    return {
        ...repositories,
        app,
        categoryService,
        productService,
        orderService,
        orderItemService,
    };
}
