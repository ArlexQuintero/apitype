import { Router } from 'express';
import * as productController from '../controllers/product.controller';

const router = Router();

// ─── CRUD de productos ───────────────────────────────
// GET    /products          → Listar todos
// GET    /products/:id      → Obtener por ID
// POST   /products          → Crear nuevo
// PUT    /products/:id      → Reemplazar completo
// PATCH  /products/:id      → Actualizar parcial
// DELETE /products/:id      → Eliminar
// ────────────────────────────────────────────────────

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.replace);
router.patch('/:id', productController.update);
router.delete('/:id', productController.remove);

export default router;
