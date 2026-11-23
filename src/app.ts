
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { createCategoryRoutes } from "./routes/categoryRoutes.js";
import { createOrderItemRoutes } from "./routes/orderItemRoutes.js";
import { createOrderRoutes } from "./routes/orderRoutes.js";
import { createProductRoutes } from "./routes/productRoutes.js";
import { CategoryService } from "./services/CategoryService.js";
import { OrderItemService } from "./services/OrderItemService.js";
import { OrderService } from "./services/OrderService.js";
import { ProductService } from "./services/ProductService.js";

export interface ApplicationServices {
    categoryService: CategoryService;
    productService: ProductService;
    orderService: OrderService;
    orderItemService: OrderItemService;
}

export const defaultServices: ApplicationServices = {
    categoryService: new CategoryService(),
    productService: new ProductService(),
    orderService: new OrderService(),
    orderItemService: new OrderItemService(),
};

export function createApp(
    services: ApplicationServices = defaultServices,
): Express {
    const app = express();

    app.disable("x-powered-by");
    app.use(express.json({ limit: "1mb" }));

    app.get("/", (_req, res) => {
        res.status(200).json({
            message: "Restaurant Ordering System API",
            version: "2.0.0",
            documentation: "/api-docs",
        });
    });

    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "ok" });
    });

    app.get("/openapi.json", (_req, res) => {
        res.status(200).json(swaggerSpec);
    });
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use("/categories", createCategoryRoutes(services.categoryService));
    app.use("/products", createProductRoutes(services.productService));
    app.use("/orders", createOrderRoutes(services.orderService));
    app.use("/order-items", createOrderItemRoutes(services.orderItemService));

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

export default createApp();
