
import { Router } from "express";
import { createOrderItemController } from "../controller/OrderItemController.js";
import type { OrderItemService } from "../services/OrderItemService.js";

export function createOrderItemRoutes(service: OrderItemService): Router {
    const router = Router();
    const controller = createOrderItemController(service);

    router.get("/", controller.getAll);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
}
