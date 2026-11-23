
import type { Request, Response } from "express";
import { OrderItemService } from "../services/OrderItemService.js";

export function createOrderItemController(service: OrderItemService) {
    return {
        getAll: async (req: Request, res: Response) => {
            res.status(200).json(await service.list(req.query.order_id));
        },

        getById: async (req: Request<{ id: string }>, res: Response) => {
            res.status(200).json(await service.getById(req.params.id));
        },

        create: async (req: Request, res: Response) => {
            res.status(201).json(await service.create(req.body));
        },

        update: async (req: Request<{ id: string }>, res: Response) => {
            res.status(200).json(await service.update(req.params.id, req.body));
        },

        remove: async (req: Request<{ id: string }>, res: Response) => {
            await service.remove(req.params.id);
            res.status(200).json({ message: "Item removido com sucesso." });
        },
    };
}
