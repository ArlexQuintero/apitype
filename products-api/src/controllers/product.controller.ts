import { Request, Response } from 'express';
import * as productService from '../services/product.service';
import { CreateProductDTO, UpdateProductDTO } from '../models/product.model';

// GET /products
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener los productos', error });
  }
};

// GET /products/:id
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    const status = error.response?.status === 404 ? 404 : 500;
    res.status(status).json({ success: false, message: 'Producto no encontrado', error });
  }
};

// POST /products
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as CreateProductDTO;

    if (!body.name || body.price === undefined) {
      res.status(400).json({ success: false, message: 'Los campos "name" y "price" son requeridos' });
      return;
    }

    const newProduct = await productService.createProduct(body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear el producto', error });
  }
};

// PUT /products/:id  (reemplazo completo)
export const replace = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as CreateProductDTO;

    if (!body.name || body.price === undefined) {
      res.status(400).json({ success: false, message: 'Los campos "name" y "price" son requeridos para PUT' });
      return;
    }

    const updated = await productService.replaceProduct(req.params.id, body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al reemplazar el producto', error });
  }
};

// PATCH /products/:id  (actualización parcial)
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as UpdateProductDTO;

    if (Object.keys(body).length === 0) {
      res.status(400).json({ success: false, message: 'Debes enviar al menos un campo para actualizar' });
      return;
    }

    const updated = await productService.updateProduct(req.params.id, body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar el producto', error });
  }
};

// DELETE /products/:id
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: 'Producto eliminado', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar el producto', error });
  }
};
