
import { Router } from "express";
import OrderController from "../controller/OrderController.js";

const router = Router();

router.get("/", OrderController.getAll);
router.get("/:id", OrderController.getById);
router.post("/", OrderController.create);
router.put("/:id", OrderController.update);
router.delete("/:id", OrderController.remove);

export default router;
