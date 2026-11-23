
import { getSupabaseClient } from "../config/supabase.js";
import type { OrderRecord, OrderStatus } from "../model/Order.js";

export interface OrderRepositoryContract {
    findAll(): Promise<OrderRecord[]>;
    findById(id: string): Promise<OrderRecord | null>;
    create(): Promise<OrderRecord>;
    update(id: string, status: OrderStatus): Promise<OrderRecord | null>;
    remove(id: string): Promise<boolean>;
}

async function findAll(): Promise<OrderRecord[]> {
    const { data, error } = await getSupabaseClient()
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data as OrderRecord[];
}

async function findById(id: string): Promise<OrderRecord | null> {
    const { data, error } = await getSupabaseClient()
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

    return data as OrderRecord | null;
}

async function create(): Promise<OrderRecord> {
    const { data, error } = await getSupabaseClient()
        .from("orders")
        .insert({ status: "pending" })
        .select()
        .single();

    if (error) throw error;

    return data as OrderRecord;
}

async function update(
    id: string,
    status: OrderStatus,
): Promise<OrderRecord | null> {
    const { data, error } = await getSupabaseClient()
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw error;

    return data as OrderRecord | null;
}

async function remove(id: string): Promise<boolean> {
    const { data, error } = await getSupabaseClient()
        .from("orders")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();

    if (error) throw error;

    return data !== null;
}

const OrderRepository: OrderRepositoryContract = {
    findAll,
    findById,
    create,
    update,
    remove
};

export default OrderRepository;
