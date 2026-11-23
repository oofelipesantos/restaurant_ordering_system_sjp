import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createTestContext } from "../helpers/createTestApp.js";

describe("Products API", () => {
    let context: ReturnType<typeof createTestContext>;
    let categoryId: string;

    beforeEach(async () => {
        context = createTestContext();
        const category = await request(context.app).post("/categories").send({
            name: "Pizzas",
            display_order: 1,
        });
        categoryId = category.body.id;
    });

    it("executa o CRUD completo de produtos", async () => {
        const created = await request(context.app).post("/products").send({
            category_id: categoryId,
            title: "Pizza Margherita",
            description: "Molho, queijo e manjericão",
            price: 39.9,
        });

        expect(created.status).toBe(201);
        expect(created.body).toMatchObject({
            title: "Pizza Margherita",
            price: 39.9,
            active: true,
            available: true,
        });

        const list = await request(context.app).get("/products");
        expect(list.status).toBe(200);
        expect(list.body).toHaveLength(1);

        const found = await request(context.app).get(`/products/${created.body.id}`);
        expect(found.status).toBe(200);
        expect(found.body.category_id).toBe(categoryId);

        const search = await request(context.app)
            .get("/products/search")
            .query({ keyword: "manjericão" });
        expect(search.status).toBe(200);
        expect(search.body).toHaveLength(1);

        const updated = await request(context.app)
            .put(`/products/${created.body.id}`)
            .send({ price: 42.5, available: false });
        expect(updated.status).toBe(200);
        expect(updated.body).toMatchObject({ price: 42.5, available: false });

        const removed = await request(context.app).delete(
            `/products/${created.body.id}`,
        );
        expect(removed.status).toBe(200);

        expect(
            (await request(context.app).get(`/products/${created.body.id}`)).status,
        ).toBe(404);
    });

    it("rejeita preço negativo e categoria inativa", async () => {
        const negativePrice = await request(context.app).post("/products").send({
            category_id: categoryId,
            title: "Produto inválido",
            price: -1,
        });
        expect(negativePrice.status).toBe(400);

        await request(context.app)
            .put(`/categories/${categoryId}`)
            .send({ active: false });

        const inactiveCategory = await request(context.app).post("/products").send({
            category_id: categoryId,
            title: "Produto bloqueado",
            price: 10,
        });
        expect(inactiveCategory.status).toBe(400);
    });
});
