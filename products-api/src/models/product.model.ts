// Modelo principal del producto
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  createdAt?: string;
}

// DTO para crear un producto (sin id ni createdAt, los genera la API)
export type CreateProductDTO = Omit<Product, 'id' | 'createdAt'>;

// DTO para actualizar un producto (todos los campos opcionales)
export type UpdateProductDTO = Partial<CreateProductDTO>;
