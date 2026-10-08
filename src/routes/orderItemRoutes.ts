
import { Router } from "express";
import OrderItemController from "../controller/OrderItemController.js";

const router = Router();

router.get("/", OrderItemController.getAll);
router.get("/:id", OrderItemController.getById);
router.post("/", OrderItemController.create);
router.put("/:id", OrderItemController.update);
router.delete("/:id", OrderItemController.remove);

export default router;
