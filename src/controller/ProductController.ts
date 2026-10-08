
import type { Request, Response } from "express";
import ProductRepository from "../repositories/ProductRepository.js";

async function getAll(req: Request, res: Response) {
    try {
        const products = await ProductRepository.findAll();

        res.status(200).json(products);
    } catch (error) {
        console.log("Erro ao buscar produtos: ", error);

        res.status(500).json({
            message: "Erro ao buscar produtos."
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do produto não informado."
        });
    }

    try {
        const product = await ProductRepository.findById(id);

        res.status(200).json(product);
    } catch (error) {
        console.log("Erro ao buscar produto: ", error);

        res.status(404).json({
            message: "Produto não encontrado."
        });
    }
}

async function create(req: Request, res: Response) {
    const {
        category_id,
        title,
        description,
        price,
        image,
        available,
        active
    } = req.body ?? {};

    if (
        typeof category_id !== "string" ||
        !category_id.trim() ||
        typeof title !== "string" ||
        !title.trim() ||
        typeof description !== "string" ||
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0 ||
        (image !== null && typeof image !== "string") ||
        typeof available !== "boolean" ||
        typeof active !== "boolean"
    ) {
        return res.status(400).json({
            message: "Dados do produto inválidos ou incompletos."
        });
    }

    try {
        const product = await ProductRepository.create({
            category_id,
            title,
            description,
            price,
            image,
            available,
            active
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Erro ao criar produto: ", error);

        res.status(500).json({
            message: "Erro ao criar produto."
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const product = req.body;

    if (!id) {
        return res.status(400).json({
            message: "ID do produto não informado."
        });
    }

    if (
        !product ||
        typeof product !== "object" ||
        Array.isArray(product)
    ) {
        return res.status(400).json({
            message: "Dados inválidos para atualização."
        });
    }

    const allowedFields = [
        "category_id",
        "title",
        "description",
        "price",
        "image",
        "available",
        "active"
    ];

    const fields = Object.keys(product);

    if (
        fields.length === 0 ||
        fields.some(field => !allowedFields.includes(field)) ||
        (product.category_id !== undefined &&
            (typeof product.category_id !== "string" || !product.category_id.trim())) ||
        (product.title !== undefined &&
            (typeof product.title !== "string" || !product.title.trim())) ||
        (product.description !== undefined &&
            typeof product.description !== "string") ||
        (product.price !== undefined &&
            (typeof product.price !== "number" ||
             !Number.isFinite(product.price) ||
             product.price < 0)) ||
        (product.image !== undefined &&
            product.image !== null &&
            typeof product.image !== "string") ||
        (product.available !== undefined &&
            typeof product.available !== "boolean") ||
        (product.active !== undefined &&
            typeof product.active !== "boolean")
    ) {
        return res.status(400).json({
            message: "Dados inválidos para atualização."
        });
    }

    try {
        const updatedProduct = await ProductRepository.update(id, product);

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log("Erro ao atualizar produto: ", error);

        res.status(500).json({
            message: "Erro ao atualizar produto."
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do produto não informado."
        });
    }

    try {
        const product = await ProductRepository.remove(id);

        if (!product) {
            return res.status(404).json({
                message: "Produto não encontrado."
            });
        }

        return res.status(200).json({
            message: "Produto removido com sucesso."
        });
    } catch (error) {
        console.log("Erro ao excluir produto: ", error);

        return res.status(500).json({
            message: "Erro ao excluir produto."
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
