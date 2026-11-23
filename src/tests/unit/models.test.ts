import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { Category } from "../../model/Category.js";
import { Order } from "../../model/Order.js";
import { OrderItem } from "../../model/OrderItem.js";
import { Product } from "../../model/Product.js";

describe("Modelos de domínio", () => {
    it("cria e atualiza uma categoria válida", () => {
        const category = Category.create({
            name: "  Pizzas  ",
            display_order: 0,
        });
        expect(category.toJSON()).toEqual({
            name: "Pizzas",
            description: null,
            icon: null,
            display_order: 0,
            active: true,
        });

        category.update({
            name: "Especiais",
            description: "Sabores especiais",
            icon: "🍕",
            display_order: 2,
            active: false,
        });
        expect(category.toJSON()).toMatchObject({
            name: "Especiais",
            description: "Sabores especiais",
            display_order: 2,
            active: false,
        });
    });

    it.each([
        [{ name: "", display_order: 1 }, "obrigatório"],
        [{ name: "Pizzas", display_order: -1 }, "maior ou igual a zero"],
        [{ name: "Pizzas", display_order: 1.5 }, "inteiro"],
        [{ name: "Pizzas", display_order: 1, active: "sim" }, "verdadeiro ou falso"],
    ])("rejeita categoria inválida", (input, message) => {
        expect(() => Category.create(input)).toThrow(message);
    });

    it("cria e atualiza um produto válido", () => {
        const categoryId = randomUUID();
        const product = Product.create({
            category_id: categoryId,
            title: "  Margherita ",
            price: 39.9,
        });
        expect(product.toJSON()).toMatchObject({
            category_id: categoryId,
            title: "Margherita",
            available: true,
            active: true,
        });

        product.update({
            title: "Margherita grande",
            description: "Massa artesanal",
            price: 45,
            image: "pizza.jpg",
            available: false,
            active: false,
        });
        expect(product.toJSON()).toMatchObject({
            title: "Margherita grande",
            price: 45,
            available: false,
            active: false,
        });
    });

    it.each([
        [{ category_id: "inválido", title: "Pizza", price: 10 }, "UUID"],
        [{ category_id: randomUUID(), title: "", price: 10 }, "obrigatório"],
        [{ category_id: randomUUID(), title: "Pizza", price: -0.01 }, "maior ou igual a zero"],
        [{ category_id: randomUUID(), title: "Pizza", price: 10, image: 123 }, "texto"],
    ])("rejeita produto inválido", (input, message) => {
        expect(() => Product.create(input)).toThrow(message);
    });

    it("controla as transições de um pedido", () => {
        const order = Order.create();
        expect(order.canReceiveItems()).toBe(true);
        order.changeStatus("preparing");
        order.changeStatus("ready");
        order.changeStatus("delivered");
        expect(order.canReceiveItems()).toBe(false);
        expect(order.canBeRemoved()).toBe(false);
        expect(() => order.changeStatus("cancelled")).toThrow("Não é permitido");
        expect(() => order.changeStatus("unknown")).toThrow("inválido");
    });

    it("valida e atualiza a quantidade de um item", () => {
        const item = OrderItem.create({
            order_id: randomUUID(),
            product_id: randomUUID(),
            quantity: 1,
            unit_price: 12.5,
        });
        item.changeQuantity(3);
        expect(item.toJSON()).toMatchObject({ quantity: 3, unit_price: 12.5 });
        expect(() => item.changeQuantity(0)).toThrow("positivo");
        expect(() =>
            OrderItem.create({
                order_id: randomUUID(),
                product_id: randomUUID(),
                quantity: 1,
                unit_price: -1,
            }),
        ).toThrow("maior ou igual a zero");
    });
});
