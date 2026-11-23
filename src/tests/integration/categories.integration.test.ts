import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createTestContext } from "../helpers/createTestApp.js";

describe("Categories API", () => {
    let context: ReturnType<typeof createTestContext>;

    beforeEach(() => {
        context = createTestContext();
    });

    it("executa o CRUD completo de categorias", async () => {
        const created = await request(context.app).post("/categories").send({
            name: "Pizzas",
            description: "Pizzas artesanais",
            icon: "🍕",
            display_order: 1,
        });

        expect(created.status).toBe(201);
        expect(created.body).toMatchObject({ name: "Pizzas", active: true });
        expect(created.body.id).toEqual(expect.any(String));

        const list = await request(context.app).get("/categories");
        expect(list.status).toBe(200);
        expect(list.body).toHaveLength(1);

        const found = await request(context.app).get(
            `/categories/${created.body.id}`,
        );
        expect(found.status).toBe(200);
        expect(found.body.name).toBe("Pizzas");

        const search = await request(context.app)
            .get("/categories/search")
            .query({ keyword: "artesanais" });
        expect(search.status).toBe(200);
        expect(search.body).toHaveLength(1);

        const updated = await request(context.app)
            .put(`/categories/${created.body.id}`)
            .send({ name: "Pizzas especiais", active: false });
        expect(updated.status).toBe(200);
        expect(updated.body).toMatchObject({
            name: "Pizzas especiais",
            active: false,
        });

        const removed = await request(context.app).delete(
            `/categories/${created.body.id}`,
        );
        expect(removed.status).toBe(200);

        const missing = await request(context.app).get(
            `/categories/${created.body.id}`,
        );
        expect(missing.status).toBe(404);
    });

    it("rejeita categoria duplicada e dados inválidos", async () => {
        const data = { name: "Bebidas", display_order: 2 };
        expect((await request(context.app).post("/categories").send(data)).status)
            .toBe(201);

        const duplicate = await request(context.app)
            .post("/categories")
            .send({ name: "bebidas", display_order: 3 });
        expect(duplicate.status).toBe(409);

        const invalid = await request(context.app)
            .post("/categories")
            .send({ name: " ", display_order: -1 });
        expect(invalid.status).toBe(400);
    });
});
