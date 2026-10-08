
import supabase from "../config/supabase.js";

export interface Product {
    category_id: string;
    title: string;
    description: string;
    price: number;
    image: string | null;
    available: boolean;
    active: boolean;
}

async function findAll() {
    const { data, error } = await supabase
        .from("products")
        .select("*");

    if (error) {
        throw error;
    }

    return data;
}

async function findById(id: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function create(product: Product) {
    const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

async function update(id: string, product: Partial<Product>) {
    const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}


async function remove(id: string) {
    const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}


export default {
    findAll,
    findById,
    create,
    update,
    remove
};
