
import { getSupabaseClient } from "../config/supabase.js";
import type { OrderItemPayload, OrderItemRecord } from "../model/OrderItem.js";

export interface OrderItemRepositoryContract {
    findAll(orderId?: string): Promise<OrderItemRecord[]>;
    findById(id: string): Promise<OrderItemRecord | null>;
    create(item: OrderItemPayload): Promise<OrderItemRecord>;
    update(id: string, quantity: number): Promise<OrderItemRecord | null>;
    remove(id: string): Promise<boolean>;
}

async function findAll(orderId?: string): Promise<OrderItemRecord[]> {
    let query = getSupabaseClient()
        .from("order_items")
        .select("*");

    if (orderId) {
        query = query.eq("order_id", orderId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as OrderItemRecord[];
}

async function findById(id: string): Promise<OrderItemRecord | null> {
    const { data, error } = await getSupabaseClient()
        .from("order_items")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;

    return data as OrderItemRecord | null;
}

async function create(item: OrderItemPayload): Promise<OrderItemRecord> {
    const { data, error } = await getSupabaseClient()
        .from("order_items")
        .insert(item)
        .select()
        .single();

    if (error) throw error;

    return data as OrderItemRecord;
}

async function update(
    id: string,
    quantity: number,
): Promise<OrderItemRecord | null> {
    const { data, error } = await getSupabaseClient()
        .from("order_items")
        .update({ quantity })
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) throw error;

    return data as OrderItemRecord | null;
}

async function remove(id: string): Promise<boolean> {
    const { data, error } = await getSupabaseClient()
        .from("order_items")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();

    if (error) throw error;

    return data !== null;
}

const OrderItemRepository: OrderItemRepositoryContract = {
    findAll,
    findById,
    create,
    update,
    remove
};

export default OrderItemRepository;
