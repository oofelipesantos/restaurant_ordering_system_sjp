
import { getSupabaseClient } from "../config/supabase.js";
import type { ProductPayload, ProductRecord } from "../model/Product.js";

export interface ProductRepositoryContract {
    findAll(): Promise<ProductRecord[]>;
    findById(id: string): Promise<ProductRecord | null>;
    searchByKeyword(keyword: string): Promise<ProductRecord[]>;
    create(product: ProductPayload): Promise<ProductRecord>;
    update(id: string, product: ProductPayload): Promise<ProductRecord | null>;
    remove(id: string): Promise<boolean>;
}

async function findAll(): Promise<ProductRecord[]> {
    const { data, error } = await getSupabaseClient()
        .from("products")
        .select("*")
        .order("title", { ascending: true });

    if (error) {
        throw error;
    }

    return data as ProductRecord[];
}

async function findById(id: string): Promise<ProductRecord | null> {
    const { data, error } = await getSupabaseClient()
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data as ProductRecord | null;
}

async function searchByKeyword(keyword: string): Promise<ProductRecord[]> {
    const { data, error } = await getSupabaseClient()
        .from("products")
        .select("*")
        .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
        .order("title", { ascending: true });

    if (error) {
        throw error;
    }

    return data as ProductRecord[];
}

async function create(product: ProductPayload): Promise<ProductRecord> {
    const { data, error } = await getSupabaseClient()
        .from("products")
        .insert(product)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data as ProductRecord;
}

async function update(
    id: string,
    product: ProductPayload,
): Promise<ProductRecord | null> {
    const { data, error } = await getSupabaseClient()
        .from("products")
        .update(product)
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data as ProductRecord | null;
}

async function remove(id: string): Promise<boolean> {
    const { data, error } = await getSupabaseClient()
        .from("products")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data !== null;
}

const ProductRepository: ProductRepositoryContract = {
    findAll,
    findById,
    searchByKeyword,
    create,
    update,
    remove
};

export default ProductRepository;
