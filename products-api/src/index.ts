import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas ────────────────────────────────
app.use('/products', productRoutes);

// ── Health check ─────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'OK',
    message: '🛒 Products API CRUD',
    endpoints: {
      'GET    /products':        'Listar todos los productos',
      'GET    /products/:id':    'Obtener un producto por ID',
      'POST   /products':        'Crear un nuevo producto',
      'PUT    /products/:id':    'Reemplazar un producto completo',
      'PATCH  /products/:id':    'Actualizar campos de un producto',
      'DELETE /products/:id':    'Eliminar un producto',
    },
  });
});

// ── 404 genérico ─────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// ── Arranque ─────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles en http://localhost:${PORT}/\n`);
});

export default app;
