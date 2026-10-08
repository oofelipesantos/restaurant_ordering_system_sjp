
import supabase from "../config/supabase.js";

export interface OrderItem {
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
}

async function findAll(orderId?: string) {
    let query = supabase
        .from("order_items")
        .select("*");

    if (orderId) {
        query = query.eq("order_id", orderId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data;
}

async function findById(id: string) {
    const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;

    return data;
}

async function findProduct(productId: string) {
    const { data, error } = await supabase
        .from("products")
        .select("id, price, available, active")
        .eq("id", productId)
        .maybeSingle();

    if (error) throw error;

    return data;
}

async function create(item: OrderItem) {
    const { data, error } = await supabase
        .from("order_items")
        .insert(item)
        .select()
        .single();

    if (error) throw error;

    return data;
}

async function update(id: string, quantity: number) {
    const { data, error } = await supabase
        .from("order_items")
        .update({ quantity })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw error;

    return data;
}

async function remove(id: string) {
    const { data, error } = await supabase
        .from("order_items")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();

    if (error) throw error;

    return data;
}

export default {
    findAll,
    findById,
    findProduct,
    create,
    update,
    remove
};
