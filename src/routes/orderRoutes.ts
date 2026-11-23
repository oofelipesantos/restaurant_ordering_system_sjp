
import { Router } from "express";
import { createOrderController } from "../controller/OrderController.js";
import type { OrderService } from "../services/OrderService.js";

export function createOrderRoutes(service: OrderService): Router {
    const router = Router();
    const controller = createOrderController(service);

    router.get("/", controller.getAll);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
}
