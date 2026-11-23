import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

interface DatabaseError {
    code?: string;
    message?: string;
}

export const notFoundHandler: RequestHandler = (req, res) => {
    res.status(404).json({
        message: `Rota ${req.method} ${req.originalUrl} não encontrada.`,
    });
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }

    const databaseError = error as DatabaseError;

    if (databaseError.code === "23505") {
        res.status(409).json({ message: "Já existe um registro com esses dados." });
        return;
    }

    if (databaseError.code === "23503") {
        res.status(409).json({
            message: "A operação viola o relacionamento entre os registros.",
        });
        return;
    }

    if (databaseError.code === "22P02") {
        res.status(400).json({ message: "Um dos valores informados é inválido." });
        return;
    }

    console.error("Erro não tratado:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
};
