// Modelo principal del producto (schema real de MockAPI)
export interface Product {
  id: string;
  name: string;
  descripcion: string;
  precio: number;
  stock: number;
}

// DTO para crear un producto (sin id, lo genera la API)
export type CreateProductDTO = Omit<Product, 'id'>;

// DTO para actualizar un producto (todos los campos opcionales)
export type UpdateProductDTO = Partial<CreateProductDTO>;
