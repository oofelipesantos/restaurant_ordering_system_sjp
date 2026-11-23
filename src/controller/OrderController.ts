
import type { Request, Response } from "express";
import { OrderService } from "../services/OrderService.js";

export function createOrderController(service: OrderService) {
    return {
        getAll: async (_req: Request, res: Response) => {
            res.status(200).json(await service.list());
        },

        getById: async (req: Request<{ id: string }>, res: Response) => {
            res.status(200).json(await service.getById(req.params.id));
        },

        create: async (_req: Request, res: Response) => {
            res.status(201).json(await service.create());
        },

        update: async (req: Request<{ id: string }>, res: Response) => {
            res.status(200).json(
                await service.updateStatus(req.params.id, req.body?.status),
            );
        },

        remove: async (req: Request<{ id: string }>, res: Response) => {
            await service.remove(req.params.id);
            res.status(200).json({ message: "Pedido removido com sucesso." });
        },
    };
}
