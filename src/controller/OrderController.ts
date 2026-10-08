
import type { Request, Response } from "express";
import OrderRepository, {
    ORDER_STATUSES
} from "../repositories/OrderRepository.js";

async function getAll(req: Request, res: Response) {
    try {
        const orders = await OrderRepository.findAll();

        return res.status(200).json(orders);
    } catch (error) {
        console.log("Erro ao buscar pedidos:", error);

        return res.status(500).json({
            message: "Erro ao buscar pedidos."
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    try {
        const order = await OrderRepository.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Pedido não encontrado."
            });
        }

        const items = order.order_items ?? [];

        const total = items.reduce(
            (sum: number, item: {
                quantity: number;
                unit_price: number;
            }) => sum + item.quantity * Number(item.unit_price),
            0
        );

        return res.status(200).json({
            ...order,
            total: Number(total.toFixed(2))
        });
    } catch (error) {
        console.log("Erro ao buscar pedido:", error);

        return res.status(500).json({
            message: "Erro ao buscar pedido."
        });
    }
}

async function create(req: Request, res: Response) {
    try {
        const order = await OrderRepository.create();

        return res.status(201).json(order);
    } catch (error) {
        console.log("Erro ao criar pedido:", error);

        return res.status(500).json({
            message: "Erro ao criar pedido."
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const status = req.body?.status;

    if (
        typeof status !== "string" ||
        !ORDER_STATUSES.some(value => value === status)
    ) {
        return res.status(400).json({
            message: "Status do pedido inválido."
        });
    }

    try {
        const order = await OrderRepository.update(
            id,
            status as typeof ORDER_STATUSES[number]
        );

        if (!order) {
            return res.status(404).json({
                message: "Pedido não encontrado."
            });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.log("Erro ao atualizar pedido:", error);

        return res.status(500).json({
            message: "Erro ao atualizar pedido."
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    try {
        const order = await OrderRepository.remove(id);

        if (!order) {
            return res.status(404).json({
                message: "Pedido não encontrado."
            });
        }

        return res.status(200).json({
            message: "Pedido removido com sucesso."
        });
    } catch (error) {
        console.log("Erro ao excluir pedido:", error);

        return res.status(500).json({
            message: "Erro ao excluir pedido."
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
