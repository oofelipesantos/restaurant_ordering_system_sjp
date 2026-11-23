import { getSupabaseClient } from "../config/supabase.js";
import type { CategoryPayload, CategoryRecord } from "../model/Category.js";

export interface CategoryRepositoryContract {
    findAll(): Promise<CategoryRecord[]>;
    findById(id: string): Promise<CategoryRecord | null>;
    findByName(name: string, excludeId?: string): Promise<CategoryRecord | null>;
    searchByKeyword(keyword: string): Promise<CategoryRecord[]>;
    create(category: CategoryPayload): Promise<CategoryRecord>;
    update(id: string, category: CategoryPayload): Promise<CategoryRecord | null>;
    remove(id: string): Promise<boolean>;
}

async function findAll(): Promise<CategoryRecord[]> {
    const { data, error } = await getSupabaseClient()
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        throw error;
    }

    return data as CategoryRecord[];
}

async function findById(id: string): Promise<CategoryRecord | null> {
    const { data, error } = await getSupabaseClient()
        .from("categories")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data as CategoryRecord | null;
}

async function findByName(
    name: string,
    excludeId?: string,
): Promise<CategoryRecord | null> {
    let query = getSupabaseClient()
        .from("categories")
        .select("*")
        .ilike("name", name);

    if (excludeId) {
        query = query.neq("id", excludeId);
    }

    const { data, error } = await query.limit(1).maybeSingle();

    if (error) {
        throw error;
    }

    return data as CategoryRecord | null;
}

async function create(category: CategoryPayload): Promise<CategoryRecord> {
    const { data, error } = await getSupabaseClient()
        .from("categories")
        .insert(category)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data as CategoryRecord;
}

async function update(
    id: string,
    category: CategoryPayload,
): Promise<CategoryRecord | null> {
    const { data, error } = await getSupabaseClient()
        .from("categories")
        .update(category)
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data as CategoryRecord | null;
}

async function remove(id: string): Promise<boolean> {
    const { data, error } = await getSupabaseClient()
        .from("categories")
        .delete()
        .eq("id", id)
        .select("id")
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data !== null;
}

async function searchByKeyword(keyword: string): Promise<CategoryRecord[]> {
    const { data, error } = await getSupabaseClient()
        .from("categories")
        .select("*")
        .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`)
        .order("display_order", { ascending: true });

    if (error) {
        throw error;
    }

    return data as CategoryRecord[];
}

const CategoryRepository: CategoryRepositoryContract = {
    findAll,
    findById,
    findByName,
    create,
    update,
    remove,
    searchByKeyword,
};

export default CategoryRepository;
