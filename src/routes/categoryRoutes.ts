import { Router } from "express";
import { createCategoryController } from "../controller/CategoryController.js";
import type { CategoryService } from "../services/CategoryService.js";

export function createCategoryRoutes(service: CategoryService): Router {
    const router = Router();
    const controller = createCategoryController(service);

    router.get("/", controller.getAll);
    router.get("/search", controller.getByKeyword);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
}
