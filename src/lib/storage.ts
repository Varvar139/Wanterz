import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    price: row.price as number,
    category: row.category as Product['category'],
    photos: (row.photos as string[]) ?? [],
    location: row.location as string,
    availability: (row.availability as Product['availability']) ?? 'available',
    expectedDate: (row.expected_date as string) ?? undefined,
    paymentLink: (row.payment_link as string) ?? undefined,
    createdAt: new Date(row.created_at as string).getTime(),
    trending: (row.trending as boolean) ?? false,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load products:', error.message);
    return [];
  }
  return (data ?? []).map(mapRow);
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load product:', error.message);
    return null;
  }
  return data ? mapRow(data) : null;
}

export async function getMyProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load my products:', error.message);
    return [];
  }
  return (data ?? []).map(mapRow);
}

export async function addProduct(
  product: Omit<Product, 'id' | 'createdAt'>
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      photos: product.photos,
      location: product.location,
      availability: product.availability,
      expected_date: product.expectedDate ?? null,
      payment_link: product.paymentLink ?? null,
      trending: product.trending ?? false,
    })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Failed to add product:', error.message);
    return null;
  }
  return data ? mapRow(data) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete product:', error.message);
    return false;
  }
  return true;
}

export type { Product };
