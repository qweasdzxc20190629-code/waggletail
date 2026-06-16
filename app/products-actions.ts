'use server';

// Server Actions so admin product mutations land on the server's own copy of
// `products` (the one Server Component pages like /category/[name] and
// /products/[id] read from). The admin dashboard is a 'use client' page —
// calling addProduct/updateProduct/deleteProduct directly from it would only
// ever mutate a separate, browser-only copy of the module that the storefront
// never sees. Routing through here runs the mutation on the server instead.

import { Product, addProduct, deleteProduct, products, updateProduct } from './products';

export async function addProductAction(product: Product): Promise<Product[]> {
  addProduct(product);
  return products.slice();
}

export async function updateProductAction(product: Product): Promise<Product[]> {
  updateProduct(product);
  return products.slice();
}

export async function deleteProductAction(id: string): Promise<Product[]> {
  deleteProduct(id);
  return products.slice();
}
