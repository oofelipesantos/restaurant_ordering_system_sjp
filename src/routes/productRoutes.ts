
import { Router } from "express";
import { createProductController } from "../controller/ProductController.js";
import type { ProductService } from "../services/ProductService.js";

export function createProductRoutes(service: ProductService): Router {
    const router = Router();
    const controller = createProductController(service);

    router.get("/", controller.getAll);
    router.get("/search", controller.search);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
}
