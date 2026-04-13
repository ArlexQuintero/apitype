// Gracias al proxy en vercel.json, usamos una ruta relativa.
// Vercel redirige /api/* → https://69dcd32684f912a264043f10.mockapi.io/api/*
// Esto evita cualquier problema de CORS en el navegador.
const BASE_URL = "/api/product";

let allProducts = [];
let editingId = null;

// ── API ────────────────────────────────────────────────
const api = {
  async getAll() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  async create(data) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  async update(id, data) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return true;
  },
};

// ── CARGAR PRODUCTOS ───────────────────────────────────
async function loadProducts() {
  renderSkeleton();
  try {
    allProducts = await api.getAll();
    updateStats(allProducts);
    renderList(allProducts);
  } catch (e) {
    toast("Error al cargar productos", "error");
    renderError();
  }
}

// ── ESTADÍSTICAS ───────────────────────────────────────
function updateStats(products) {
  document.getElementById("stat-total").textContent = products.length;

  const precios = products
    .map((p) => parseFloat(p.precio || 0))
    .filter((n) => !isNaN(n));
  const avg =
    precios.length ? precios.reduce((a, b) => a + b, 0) / precios.length : 0;
  document.getElementById("stat-avg").textContent = "$" + avg.toFixed(0);

  const stockTotal = products.reduce(
    (acc, p) => acc + (parseInt(p.stock) || 0),
    0
  );
  document.getElementById("stat-stock").textContent = stockTotal;

  const stockBajo = products.filter(
    (p) => parseInt(p.stock || 0) <= 5
  ).length;
  document.getElementById("stat-low").textContent = stockBajo;
}

// ── RENDER LISTA ───────────────────────────────────────
function renderList(products) {
  const el = document.getElementById("product-list");
  if (!products.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">◌</div>
        <p>No hay productos</p>
      </div>`;
    return;
  }

  el.innerHTML = products
    .map((p) => {
      const stockNum = parseInt(p.stock || 0);
      const isLow = stockNum <= 5;
      const desc = (p.descripcion || "Sin descripción").slice(0, 50);
      const descExtra = (p.descripcion || "").length > 50 ? "…" : "";

      return `
        <div class="product-item ${editingId == p.id ? "selected" : ""}" id="item-${p.id}">
          <div style="min-width:0;">
            <div class="product-name">${esc(p.name || "Sin nombre")}</div>
            <div class="product-meta">
              <span class="product-id">#${p.id}</span>
              <span>${esc(desc)}${descExtra}</span>
            </div>
          </div>
          <div class="product-right">
            <div class="price-stock">
              <span class="product-price">$${parseFloat(p.precio || 0).toFixed(2)}</span>
              <span class="product-stock ${isLow ? "stock-low" : ""}">
                ${isLow ? "⚠ " : ""}Stock: ${stockNum}
              </span>
            </div>
            <div class="item-actions">
              <button class="icon-btn edit-btn" onclick="startEdit(${p.id})" title="Editar">✎</button>
              <button class="icon-btn del-btn"  onclick="deleteProduct(${p.id})" title="Eliminar">✕</button>
            </div>
          </div>
        </div>`;
    })
    .join("");
}

function renderSkeleton() {
  document.getElementById("product-list").innerHTML = Array.from(
    { length: 5 },
    () => `
      <div style="padding:1rem 1.1rem;border:1px solid var(--border);border-radius:12px;margin-bottom:8px;display:flex;gap:12px;align-items:center;">
        <div style="flex:1;">
          <div class="skeleton" style="height:14px;width:55%;margin-bottom:8px;"></div>
          <div class="skeleton" style="height:11px;width:38%;"></div>
        </div>
        <div class="skeleton" style="height:14px;width:60px;"></div>
      </div>`
  ).join("");
}

function renderError() {
  document.getElementById("product-list").innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">⚠</div>
      <p>No se pudo conectar a la API</p>
    </div>`;
}

// ── BÚSQUEDA ───────────────────────────────────────────
function filterProducts() {
  const q = document.getElementById("search-input").value.toLowerCase();
  const filtered = allProducts.filter(
    (p) =>
      (p.name        || "").toLowerCase().includes(q) ||
      (p.descripcion || "").toLowerCase().includes(q) ||
      String(p.id).includes(q)
  );
  renderList(filtered);
}

// ── SUBMIT FORMULARIO ──────────────────────────────────
async function handleSubmit() {
  const name        = document.getElementById("f-name").value.trim();
  const descripcion = document.getElementById("f-desc").value.trim();
  const precio      = document.getElementById("f-precio").value.trim();
  const stock       = document.getElementById("f-stock").value.trim();

  if (!name) {
    toast("El nombre es requerido", "error");
    return;
  }

  const data = {
    name,
    descripcion,
    precio: parseFloat(precio) || 0,
    stock:  parseInt(stock)    || 0,
  };

  const btn = document.getElementById("submit-btn");
  btn.textContent = editingId ? "Guardando…" : "Creando…";
  btn.disabled = true;

  try {
    if (editingId) {
      await api.update(editingId, data);
      toast("Producto actualizado ✓", "success");
    } else {
      await api.create(data);
      toast("Producto creado ✓", "success");
    }
    resetForm();
    await loadProducts();
  } catch (e) {
    toast("Error: " + e.message, "error");
  } finally {
    btn.textContent = editingId ? "Guardar cambios" : "✦ Crear producto";
    btn.disabled = false;
  }
}

// ── EDITAR ─────────────────────────────────────────────
function startEdit(id) {
  const p = allProducts.find((x) => x.id == id);
  if (!p) return;

  editingId = id;
  document.getElementById("f-name").value   = p.name        || "";
  document.getElementById("f-desc").value   = p.descripcion || "";
  document.getElementById("f-precio").value = p.precio      || "";
  document.getElementById("f-stock").value  = p.stock       || "";

  document.getElementById("submit-btn").textContent   = "Guardar cambios";
  document.getElementById("cancel-btn").style.display = "block";
  document.getElementById("form-title").textContent   = "Editando producto";
  document.getElementById("mode-badge").textContent   = "Editar";
  document.getElementById("mode-badge").className     = "mode-badge edit";

  renderList(allProducts);
  document.querySelector(".panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelEdit() {
  resetForm();
  renderList(allProducts);
}

function resetForm() {
  editingId = null;
  ["f-name", "f-desc", "f-precio", "f-stock"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  document.getElementById("submit-btn").textContent   = "✦ Crear producto";
  document.getElementById("cancel-btn").style.display = "none";
  document.getElementById("form-title").textContent   = "Nuevo producto";
  document.getElementById("mode-badge").textContent   = "Crear";
  document.getElementById("mode-badge").className     = "mode-badge create";
}

// ── ELIMINAR ───────────────────────────────────────────
async function deleteProduct(id) {
  if (!confirm(`¿Eliminar producto #${id}?`)) return;
  try {
    await api.delete(id);
    toast(`Producto #${id} eliminado`, "info");
    if (editingId == id) resetForm();
    await loadProducts();
  } catch (e) {
    toast("Error al eliminar: " + e.message, "error");
  }
}

// ── TOAST ──────────────────────────────────────────────
function toast(msg, type = "info") {
  const wrap = document.getElementById("toast-wrap");
  const icons = { success: "✓", error: "✕", info: "✦" };
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span>${msg}`;
  wrap.appendChild(el);
  setTimeout(() => (el.style.opacity = "0"), 2800);
  setTimeout(() => {
    if (wrap.contains(el)) wrap.removeChild(el);
  }, 3200);
}

// ── ESCAPE HTML ────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── INIT ───────────────────────────────────────────────
loadProducts();
