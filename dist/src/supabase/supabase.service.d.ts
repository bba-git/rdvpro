import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    getClient(): SupabaseClient;
}
