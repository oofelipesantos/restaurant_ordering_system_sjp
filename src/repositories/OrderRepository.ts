
import supabase from "../config/supabase.js";

export const ORDER_STATUSES = [
    "pending",
    "preparing",
    "ready",
    "delivered",
    "cancelled"
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

async function findAll() {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
}

async function findById(id: string) {
    const { data, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                id,
                product_id,
                quantity,
                unit_price
            )
        `)
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;

    return data;
}

async function create() {
    const { data, error } = await supabase
        .from("orders")
        .insert({ status: "pending" })
        .select()
        .single();

    if (error) throw error;

    return data;
}

async function update(id: string, status: OrderStatus) {
    const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw error;

    return data;
}

async function remove(id: string) {
    const { data, error } = await supabase
        .from("orders")
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
    create,
    update,
    remove
};
