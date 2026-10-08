
import type { Request, Response } from "express";
import OrderItemRepository from "../repositories/OrderItemRepository.js";

async function getAll(req: Request, res: Response) {
    const { order_id } = req.query;

    if (order_id !== undefined && typeof order_id !== "string") {
        return res.status(400).json({
            message: "ID do pedido inválido."
        });
    }

    try {
        const items = await OrderItemRepository.findAll(order_id);

        return res.status(200).json(items);
    } catch (error) {
        console.log("Erro ao buscar itens:", error);

        return res.status(500).json({
            message: "Erro ao buscar itens."
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    try {
        const item = await OrderItemRepository.findById(id);

        if (!item) {
            return res.status(404).json({
                message: "Item não encontrado."
            });
        }

        return res.status(200).json(item);
    } catch (error) {
        console.log("Erro ao buscar item:", error);

        return res.status(500).json({
            message: "Erro ao buscar item."
        });
    }
}

async function create(req: Request, res: Response) {
    const {
        order_id,
        product_id,
        quantity
    } = req.body ?? {};

    if (
        typeof order_id !== "string" ||
        !order_id.trim() ||
        typeof product_id !== "string" ||
        !product_id.trim() ||
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {
        return res.status(400).json({
            message: "Dados do item inválidos."
        });
    }

    try {
        const product = await OrderItemRepository.findProduct(product_id);

        if (!product) {
            return res.status(404).json({
                message: "Produto não encontrado."
            });
        }

        if (!product.available || !product.active) {
            return res.status(400).json({
                message: "Produto indisponível."
            });
        }

        const item = await OrderItemRepository.create({
            order_id,
            product_id,
            quantity,
            unit_price: Number(product.price)
        });

        return res.status(201).json(item);
    } catch (error) {
        console.log("Erro ao criar item:", error);

        return res.status(500).json({
            message: "Erro ao criar item do pedido."
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const { quantity } = req.body ?? {};

    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {
        return res.status(400).json({
            message: "Quantidade inválida."
        });
    }

    try {
        const item = await OrderItemRepository.update(id, quantity);

        if (!item) {
            return res.status(404).json({
                message: "Item não encontrado."
            });
        }

        return res.status(200).json(item);
    } catch (error) {
        console.log("Erro ao atualizar item:", error);

        return res.status(500).json({
            message: "Erro ao atualizar item."
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    try {
        const item = await OrderItemRepository.remove(id);

        if (!item) {
            return res.status(404).json({
                message: "Item não encontrado."
            });
        }

        return res.status(200).json({
            message: "Item removido com sucesso."
        });
    } catch (error) {
        console.log("Erro ao excluir item:", error);

        return res.status(500).json({
            message: "Erro ao excluir item."
        });
    }
}

export default {
    getAll,
    getById,
    create,
    update,
    remove
};
