import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createTestContext } from "../helpers/createTestApp.js";

describe("Order Items API", () => {
    let context: ReturnType<typeof createTestContext>;
    let orderId: string;
    let productId: string;

    beforeEach(async () => {
        context = createTestContext();
        const category = await request(context.app).post("/categories").send({
            name: "Pizzas",
            display_order: 1,
        });
        const product = await request(context.app).post("/products").send({
            category_id: category.body.id,
            title: "Pizza Margherita",
            price: 39.9,
        });
        const order = await request(context.app).post("/orders");
        productId = product.body.id;
        orderId = order.body.id;
    });

    it("executa o CRUD completo de itens e calcula o total do pedido", async () => {
        const created = await request(context.app).post("/order-items").send({
            order_id: orderId,
            product_id: productId,
            quantity: 2,
        });
        expect(created.status).toBe(201);
        expect(created.body).toMatchObject({ quantity: 2, unit_price: 39.9 });

        const list = await request(context.app)
            .get("/order-items")
            .query({ order_id: orderId });
        expect(list.status).toBe(200);
        expect(list.body).toHaveLength(1);

        const found = await request(context.app).get(
            `/order-items/${created.body.id}`,
        );
        expect(found.status).toBe(200);

        const updated = await request(context.app)
            .put(`/order-items/${created.body.id}`)
            .send({ quantity: 3 });
        expect(updated.status).toBe(200);
        expect(updated.body.quantity).toBe(3);

        const order = await request(context.app).get(`/orders/${orderId}`);
        expect(order.body.total).toBe(119.7);

        const removed = await request(context.app).delete(
            `/order-items/${created.body.id}`,
        );
        expect(removed.status).toBe(200);
        expect(
            (await request(context.app).get(`/order-items/${created.body.id}`)).status,
        ).toBe(404);
    });

    it("rejeita quantidade inválida, produto indisponível e pedido não pendente", async () => {
        const invalidQuantity = await request(context.app)
            .post("/order-items")
            .send({ order_id: orderId, product_id: productId, quantity: 0 });
        expect(invalidQuantity.status).toBe(400);

        await request(context.app)
            .put(`/products/${productId}`)
            .send({ available: false });
        const unavailable = await request(context.app)
            .post("/order-items")
            .send({ order_id: orderId, product_id: productId, quantity: 1 });
        expect(unavailable.status).toBe(400);

        await request(context.app)
            .put(`/products/${productId}`)
            .send({ available: true });
        await request(context.app)
            .put(`/orders/${orderId}`)
            .send({ status: "preparing" });

        const closedOrder = await request(context.app)
            .post("/order-items")
            .send({ order_id: orderId, product_id: productId, quantity: 1 });
        expect(closedOrder.status).toBe(400);
    });
});
