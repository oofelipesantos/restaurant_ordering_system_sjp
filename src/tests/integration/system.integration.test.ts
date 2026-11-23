import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createTestContext } from "../helpers/createTestApp.js";

describe("Rotas de sistema e tratamento de erros", () => {
    it("expõe informações básicas, saúde e contrato OpenAPI", async () => {
        const { app } = createTestContext();

        const root = await request(app).get("/");
        expect(root.status).toBe(200);
        expect(root.body.documentation).toBe("/api-docs");

        const health = await request(app).get("/health");
        expect(health.status).toBe(200);
        expect(health.body.status).toBe("ok");

        const openapi = await request(app).get("/openapi.json");
        expect(openapi.status).toBe(200);
        expect(openapi.body.openapi).toBe("3.0.3");
        expect(openapi.body.paths["/categories"]).toBeDefined();

        const missing = await request(app).get("/rota-inexistente");
        expect(missing.status).toBe(404);
        expect(missing.body.message).toContain("não encontrada");
    });

    it.each([
        ["23505", 409, "Já existe"],
        ["23503", 409, "relacionamento"],
        ["22P02", 400, "inválido"],
    ])("mapeia o erro de banco %s", async (code, status, message) => {
        const context = createTestContext();
        vi.spyOn(context.categoryRepository, "findAll").mockRejectedValueOnce({
            code,
        });

        const response = await request(context.app).get("/categories");
        expect(response.status).toBe(status);
        expect(response.body.message).toContain(message);
    });

    it("oculta detalhes de um erro inesperado", async () => {
        const context = createTestContext();
        vi.spyOn(context.categoryRepository, "findAll").mockRejectedValueOnce(
            new Error("detalhe interno"),
        );
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        const response = await request(context.app).get("/categories");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Erro interno do servidor." });
        consoleSpy.mockRestore();
    });
});
