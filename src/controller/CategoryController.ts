import type { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService.js";

export function createCategoryController(service: CategoryService) {
    return {
        getAll: async (_req: Request, res: Response) => {
            res.status(200).json(await service.list());
        },

        getByKeyword: async (req: Request, res: Response) => {
            res.status(200).json(await service.search(req.query.keyword));
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
            res.status(200).json({ message: "Categoria removida com sucesso." });
        },
    };
}
