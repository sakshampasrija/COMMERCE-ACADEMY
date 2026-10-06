import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project URL provided by the user
export const DEFAULT_SUPABASE_URL = 'https://ffqhnccsayriiymnnsfe.supabase.co';

// Helper to retrieve saved anon key or default
export function getStoredAnonKey(): string {
  try {
    const saved = localStorage.getItem('classflow_supabase_anon_key');
    if (saved) return saved;
    return (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  } catch {
    return '';
  }
}

export function setStoredAnonKey(key: string): void {
  try {
    localStorage.setItem('classflow_supabase_anon_key', key.trim());
  } catch (e) {
    console.error('Failed to save Supabase anon key', e);
  }
}

export function getStoredSupabaseUrl(): string {
  try {
    const saved = localStorage.getItem('classflow_supabase_url');
    if (saved) return saved;
    return (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  } catch {
    return DEFAULT_SUPABASE_URL;
  }
}

export function setStoredSupabaseUrl(url: string): void {
  try {
    localStorage.setItem('classflow_supabase_url', url.trim());
  } catch (e) {
    console.error('Failed to save Supabase URL', e);
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = getStoredSupabaseUrl();
  const anonKey = getStoredAnonKey();

  if (!anonKey) {
    return null;
  }

  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }
    return supabaseInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function resetSupabaseClient(): void {
  supabaseInstance = null;
}
