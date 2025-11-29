/**
 * Database helper functions for Supabase
 * Provides utilities for common query patterns
 */

import { supabaseAdmin } from './supabase';


/**
 * Helper to build Supabase query with filters
 */
export async function queryBuilder<T>(
  table: string,
  options: {
    select?: string;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    offset?: number;
  }
): Promise<T[]> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  let query: any = supabaseAdmin.from(table);

  // Select columns
  if (options.select) {
    query = query.select(options.select);
  } else {
    query = query.select('*');
  }

  // Apply filters
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string' && value.includes('%')) {
          // LIKE query
          query = query.ilike(key, value.replace(/%/g, ''));
        } else if (Array.isArray(value)) {
          // IN query
          query = query.in(key, value);
        } else if (typeof value === 'boolean') {
          // Boolean equality
          query = query.eq(key, value);
        } else {
          // Equality
          query = query.eq(key, value);
        }
      }
    });
  }

  // Order by
  if (options.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending !== false,
    });
  }

  // Limit and offset
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as T[];
}

/**
 * Get single row
 */
export async function queryOneBuilder<T>(
  table: string,
  options: {
    select?: string;
    filters?: Record<string, any>;
  }
): Promise<T | null> {
  const results = await queryBuilder<T>(table, { ...options, limit: 1 });
  return results.length > 0 ? results[0] : null;
}

/**
 * Insert data
 */
export async function insert<T>(
  table: string,
  data: Partial<T> | Partial<T>[]
): Promise<T[]> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  // Convert boolean values properly for PostgreSQL
  const normalizedData = Array.isArray(data) 
    ? data.map(item => normalizeData(item))
    : normalizeData(data);

  const { data: result, error } = await supabaseAdmin
    .from(table)
    .insert(normalizedData)
    .select();

  if (error) {
    throw error;
  }

  return result as T[];
}

/**
 * Normalize data for PostgreSQL (convert boolean, handle dates, etc.)
 */
function normalizeData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const normalized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      normalized[key] = null;
    } else if (typeof value === 'boolean') {
      normalized[key] = value;
    } else if (value instanceof Date) {
      normalized[key] = value.toISOString();
    } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      // Already ISO string
      normalized[key] = value;
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
}

/**
 * Update data
 */
export async function update<T>(
  table: string,
  filters: Record<string, any>,
  data: Partial<T>
): Promise<T[]> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  // Normalize data for PostgreSQL
  const normalizedData = normalizeData(data);

  let query: any = supabaseAdmin.from(table).update(normalizedData);

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query = query.eq(key, value);
    }
  });

  const { data: result, error } = await query.select();

  if (error) {
    throw error;
  }

  return result as T[];
}

/**
 * Delete data
 */
export async function deleteRows<T>(
  table: string,
  filters: Record<string, any>
): Promise<T[]> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  let query: any = supabaseAdmin.from(table).delete();

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { data: result, error } = await query.select();

  if (error) {
    throw error;
  }

  return result as T[];
}

/**
 * Count rows
 */
export async function count(
  table: string,
  filters?: Record<string, any>
): Promise<number> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  let query: any = supabaseAdmin.from(table).select('*', { count: 'exact', head: true });

  // Apply filters
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count || 0;
}

/**
 * Call RPC function
 */
export async function rpc<T>(
  functionName: string,
  params?: Record<string, any>
): Promise<T> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  const { data, error } = await supabaseAdmin.rpc(functionName, params || {});

  if (error) {
    throw error;
  }

  return data as T;
}

