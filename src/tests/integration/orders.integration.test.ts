import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createTestContext } from "../helpers/createTestApp.js";

describe("Orders API", () => {
    let context: ReturnType<typeof createTestContext>;

    beforeEach(() => {
        context = createTestContext();
    });

    it("executa criação, consultas, atualização e exclusão", async () => {
        const created = await request(context.app).post("/orders");
        expect(created.status).toBe(201);
        expect(created.body.status).toBe("pending");

        const list = await request(context.app).get("/orders");
        expect(list.status).toBe(200);
        expect(list.body).toHaveLength(1);

        const found = await request(context.app).get(`/orders/${created.body.id}`);
        expect(found.status).toBe(200);
        expect(found.body.total).toBe(0);

        const updated = await request(context.app)
            .put(`/orders/${created.body.id}`)
            .send({ status: "preparing" });
        expect(updated.status).toBe(200);
        expect(updated.body.status).toBe("preparing");

        const removable = await request(context.app).post("/orders");
        const removed = await request(context.app).delete(
            `/orders/${removable.body.id}`,
        );
        expect(removed.status).toBe(200);
        expect(
            (await request(context.app).get(`/orders/${removable.body.id}`)).status,
        ).toBe(404);
    });

    it("aplica as regras de transição e exclusão de pedido entregue", async () => {
        const created = await request(context.app).post("/orders");

        const invalidTransition = await request(context.app)
            .put(`/orders/${created.body.id}`)
            .send({ status: "delivered" });
        expect(invalidTransition.status).toBe(400);

        for (const status of ["preparing", "ready", "delivered"]) {
            const response = await request(context.app)
                .put(`/orders/${created.body.id}`)
                .send({ status });
            expect(response.status).toBe(200);
        }

        const removal = await request(context.app).delete(
            `/orders/${created.body.id}`,
        );
        expect(removal.status).toBe(409);
    });
});
