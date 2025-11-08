/**
 * Database helper functions using Supabase
 * 
 * IMPORTANT: This file provides compatibility functions for existing MySQL queries.
 * For new code, prefer using db-helpers.ts which provides better Supabase integration.
 * 
 * For complex queries with JOINs and subqueries, you have two options:
 * 1. Use PostgreSQL functions (RPC) - see MIGRATION_GUIDE.md
 * 2. Refactor to use Supabase query builder - see db-helpers.ts
 */

import { supabaseAdmin } from './supabase';
import { queryBuilder, queryOneBuilder, update as updateHelper, insert as insertHelper, deleteRows as deleteHelper } from './db-helpers';

/**
 * Execute a query - compatibility function for MySQL-style queries
 * 
 * ⚠️ WARNING: This is a compatibility layer. For best results:
 * - Simple queries: Use db-helpers.ts functions
 * - Complex queries: Create PostgreSQL RPC functions
 * 
 * This function attempts to parse simple SQL queries but has limitations.
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized');
    }

    const sqlUpper = sql.trim().toUpperCase();
    
    // Handle simple SELECT queries
    if (sqlUpper.startsWith('SELECT')) {
      // Try to extract table name
      const fromMatch = sql.match(/FROM\s+(\w+)/i);
      if (fromMatch) {
        const tableName = fromMatch[1];
        
        // Parse WHERE conditions
        const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i);
        const filters: Record<string, any> = {};
        
        if (whereMatch && params) {
          const whereClause = whereMatch[1];
          // Simple parser for "column = ?" patterns
          const conditions = whereClause.split(/\s+AND\s+/i);
          conditions.forEach((condition, index) => {
            if (condition.includes(' = ?')) {
              const column = condition.split(' = ?')[0].trim();
              if (params[index] !== undefined) {
                filters[column] = params[index];
              }
            } else if (condition.includes(' LIKE ?')) {
              const column = condition.split(' LIKE ?')[0].trim();
              if (params[index] !== undefined) {
                const likeValue = params[index] as string;
                filters[column] = likeValue.replace(/%/g, '');
              }
            }
          });
        }
        
        // Parse LIMIT
        const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
        const limit = limitMatch ? parseInt(limitMatch[1]) : undefined;
        
        // Parse OFFSET
        const offsetMatch = sql.match(/OFFSET\s+(\d+)/i);
        const offset = offsetMatch ? parseInt(offsetMatch[1]) : undefined;
        
        // Use query builder
        const results = await queryBuilder<T>(tableName, {
          filters: Object.keys(filters).length > 0 ? filters : undefined,
          limit,
          offset,
        });
        
        return results as T;
      }
    }
    
    // Handle UPDATE queries
    if (sqlUpper.startsWith('UPDATE')) {
      const updateMatch = sql.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+)/i);
      if (updateMatch && params) {
        const tableName = updateMatch[1];
        const setClause = updateMatch[2];
        const whereClause = updateMatch[3];
        
        // Parse SET clause more carefully
        const updates: Record<string, any> = {};
        const setPairs = setClause.split(',').map(p => p.trim());
        let paramIndex = 0;
        
        setPairs.forEach((pair) => {
          const equalIndex = pair.indexOf('=');
          if (equalIndex === -1) return;
          
          const column = pair.substring(0, equalIndex).trim();
          const value = pair.substring(equalIndex + 1).trim();
          const valueUpper = value.toUpperCase();
          
          if (value === '?') {
            updates[column] = params[paramIndex++];
          } else if (valueUpper === 'NOW()' || valueUpper === 'CURRENT_TIMESTAMP') {
            updates[column] = new Date().toISOString();
          } else if (value.includes(' + ?') || value.includes(' - ?')) {
            // Handle expressions like "column + ?" or "column - ?"
            // For Supabase, we need to use RPC or handle differently
            // For now, try to extract the operation
            if (value.includes(' + ?')) {
              const increment = params[paramIndex++];
              // This is complex - would need to fetch current value first
              // For now, just use the param value
              updates[column] = increment;
            } else if (value.includes(' - ?')) {
              const decrement = params[paramIndex++];
              updates[column] = -decrement;
            }
          } else if (value.match(/^'([^']*)'$/)) {
            updates[column] = value.match(/^'([^']*)'$/)?.[1];
          } else if (value.match(/^\d+$/)) {
            updates[column] = parseInt(value);
          } else if (value.match(/^\d+\.\d+$/)) {
            updates[column] = parseFloat(value);
          } else if (valueUpper === 'TRUE' || valueUpper === 'FALSE') {
            updates[column] = valueUpper === 'TRUE';
          } else {
            // Try to use param
            if (paramIndex < params.length) {
              updates[column] = params[paramIndex++];
            }
          }
        });
        
        // Parse WHERE clause
        const filters: Record<string, any> = {};
        if (whereClause.includes(' = ?')) {
          const column = whereClause.split(' = ?')[0].trim();
          filters[column] = params[paramIndex] !== undefined ? params[paramIndex] : params[params.length - 1];
        } else if (whereClause.includes(' id = ?')) {
          filters.id = params[params.length - 1];
        }
        
        await updateHelper(tableName, filters, updates);
        return [] as T; // UPDATE doesn't return data by default
      }
    }
    
    // Handle INSERT queries
    if (sqlUpper.startsWith('INSERT')) {
      const insertMatch = sql.match(/INSERT INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
      if (insertMatch && params) {
        const tableName = insertMatch[1];
        const columns = insertMatch[2].split(',').map(c => c.trim());
        const valuesStr = insertMatch[3];
        
        // Parse values more carefully (handle commas in strings, functions, etc.)
        const values: string[] = [];
        let currentValue = '';
        let inQuotes = false;
        let quoteChar = '';
        
        for (let i = 0; i < valuesStr.length; i++) {
          const char = valuesStr[i];
          
          if ((char === '"' || char === "'") && (i === 0 || valuesStr[i - 1] !== '\\')) {
            if (!inQuotes) {
              inQuotes = true;
              quoteChar = char;
            } else if (char === quoteChar) {
              inQuotes = false;
              quoteChar = '';
            }
            currentValue += char;
          } else if (char === ',' && !inQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        if (currentValue.trim()) {
          values.push(currentValue.trim());
        }
        
        // Build data object from columns and params
        const data: Record<string, any> = {};
        let paramIndex = 0;
        
        columns.forEach((column, index) => {
          const value = values[index]?.trim() || '';
          const valueUpper = value.toUpperCase();
          
          if (value === '?') {
            data[column] = params[paramIndex++];
          } else if (valueUpper === 'TRUE') {
            data[column] = true;
          } else if (valueUpper === 'FALSE') {
            data[column] = false;
          } else if (valueUpper === 'NOW()' || valueUpper === 'CURRENT_TIMESTAMP') {
            data[column] = new Date().toISOString();
          } else if (value.match(/^'([^']*)'$/)) {
            // String literal
            data[column] = value.match(/^'([^']*)'$/)?.[1];
          } else if (value.match(/^"([^"]*)"$/)) {
            // Double-quoted string literal
            data[column] = value.match(/^"([^"]*)"$/)?.[1];
          } else if (value.match(/^\d+$/)) {
            // Integer literal
            data[column] = parseInt(value);
          } else if (value.match(/^\d+\.\d+$/)) {
            // Decimal literal
            data[column] = parseFloat(value);
          } else {
            // Try to use param if available
            if (paramIndex < params.length) {
              data[column] = params[paramIndex++];
            } else {
              // Keep as-is (might be a function or expression)
              data[column] = value;
            }
          }
        });
        
        // Use insert helper
        const result = await insertHelper(tableName, data);
        return result as T;
      }
      
      // Fallback: try to use insert helper with parsed data
      console.warn('⚠️ Complex INSERT query detected. Consider using insert() from db-helpers.ts directly');
      throw new Error('Please use insert() from db-helpers.ts for INSERT queries');
    }
    
    // For complex queries, suggest using RPC
    console.warn('⚠️ Complex SQL query detected. Consider:');
    console.warn('  1. Using db-helpers.ts functions for simple queries');
    console.warn('  2. Creating PostgreSQL RPC functions for complex queries');
    console.warn('  SQL:', sql);
    
    throw new Error('Complex SQL queries require PostgreSQL functions. Please use Supabase query builder or create RPC functions. See MIGRATION_GUIDE.md');
  } catch (error) {
    console.error('Database query error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Get a single row (compatibility function)
 */
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  try {
    const results = await query<T[]>(sql, params);
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Transaction helper (Supabase supports transactions via RPC)
 */
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  // Supabase doesn't have explicit transactions in the JS client
  // For transactions, we need to use PostgreSQL functions or Supabase Edge Functions
  // This is a compatibility wrapper
  try {
    return await callback(supabaseAdmin);
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

/**
 * Test connection
 */
export async function testConnection() {
  try {
    if (!supabaseAdmin) {
      console.error('❌ Supabase admin client not initialized');
      return false;
    }
    
    const { data, error } = await supabaseAdmin.from('users').select('id').limit(1);
    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
    console.log('✅ Database connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Export Supabase client for direct use
export { supabaseAdmin as db };
// Export helper functions for easier migration
export { queryBuilder, queryOneBuilder, insert, update, deleteRows, rpc } from './db-helpers';
