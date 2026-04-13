import apiClient from '../config/apiClient';
import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product.model';

const ENDPOINT = '/products';

// ─────────────────────────────────────────
//  GET /products  →  Listar todos
// ─────────────────────────────────────────
export const getAllProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>(ENDPOINT);
  return response.data;
};

// ─────────────────────────────────────────
//  GET /products/:id  →  Obtener uno
// ─────────────────────────────────────────
export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get<Product>(`${ENDPOINT}/${id}`);
  return response.data;
};

// ─────────────────────────────────────────
//  POST /products  →  Crear
// ─────────────────────────────────────────
export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  const response = await apiClient.post<Product>(ENDPOINT, data);
  return response.data;
};

// ─────────────────────────────────────────
//  PUT /products/:id  →  Reemplazar completo
// ─────────────────────────────────────────
export const replaceProduct = async (id: string, data: CreateProductDTO): Promise<Product> => {
  const response = await apiClient.put<Product>(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// ─────────────────────────────────────────
//  PUT /products/:id  →  Actualizar parcial
// ─────────────────────────────────────────
export const updateProduct = async (id: string, data: UpdateProductDTO): Promise<Product> => {
  const response = await apiClient.put<Product>(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// ─────────────────────────────────────────
//  DELETE /products/:id  →  Eliminar
// ─────────────────────────────────────────
export const deleteProduct = async (id: string): Promise<Product> => {
  const response = await apiClient.delete<Product>(`${ENDPOINT}/${id}`);
  return response.data;
};
