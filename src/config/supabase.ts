import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ConfigurationError } from "../errors/AppError.js";

let client: SupabaseClient | undefined;

export function getSupabaseClient(): SupabaseClient {
    if (client) {
        return client;
    }

    const url = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secretKey) {
        throw new ConfigurationError(
            "SUPABASE_URL e SUPABASE_SECRET_KEY devem ser configuradas no arquivo .env.",
        );
    }

    client = createClient(url, secretKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });

    return client;
}
