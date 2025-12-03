// script.js
// Funcionalidad: renderizar productos, agregar al carrito, actualizar cantidades, persistencia con localStorage.

// Cargar productos en #productos (si existe)
const contenedorProductos = document.getElementById('productos');
const listaCarritoElems = document.querySelectorAll('#lista-carrito');
const totalElem = document.querySelectorAll('#total');

if (contenedorProductos) {
  productos.forEach(prod => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
      <h3>${prod.nombre}</h3>
      <p class="small">${prod.descripcion}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <div class="price">$${prod.precio.toLocaleString()}</div>
        <div>
          <button class="btn btn-agregar" data-id="${prod.id}">Agregar</button>
        </div>
      </div>
    `;
    contenedorProductos.appendChild(card);
  });
}

// Estado del carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarTodasVistas();
}

// Añadir producto al carrito
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn-agregar')) {
    const id = Number(e.target.dataset.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    const item = carrito.find(i => i.id === id);
    if (item) item.cantidad++;
    else carrito.push({ ...producto, cantidad: 1 });
    guardarCarrito();
    // pequeña notificación visual
    e.target.innerText = 'Agregado';
    setTimeout(()=> e.target.innerText = 'Agregar', 700);
  }
});

// Funciones para incrementar, decrementar y eliminar
document.addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id);
  if (e.target.matches('.mas')) {
    const item = carrito.find(i => i.id === id);
    if (item) { item.cantidad++; guardarCarrito(); }
  }
  if (e.target.matches('.menos')) {
    const item = carrito.find(i => i.id === id);
    if (item && item.cantidad > 1) { item.cantidad--; guardarCarrito(); }
  }
  if (e.target.matches('.eliminar')) {
    carrito = carrito.filter(i => i.id !== id);
    guardarCarrito();
  }
});

// Vaciar carrito (botones)
document.addEventListener('click', (e) => {
  if (e.target.matches('#vaciarBtn') || e.target.matches('#vaciarBtnPage')) {
    carrito = [];
    guardarCarrito();
  }
  if (e.target.matches('#checkoutBtn') || e.target.matches('#checkoutBtnPage')) {
    if (carrito.length === 0) { alert('El carrito está vacío'); return; }
    // Simulamos compra
    alert('Compra simulada. Gracias por tu compra 🙂');
    carrito = [];
    guardarCarrito();
  }
});

// Actualizar la visualización del carrito en todas las páginas
function actualizarTodasVistas() {
  // Actualiza todos los elementos #lista-carrito (puede haber más de uno)
  listaCarritoElems.forEach(ul => {
    ul.innerHTML = '';
    carrito.forEach(prod => {
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `
        <div style="display:flex; gap:8px; align-items:center;">
          <img src="${prod.imagen}" alt="${prod.nombre}" style="width:56px; height:40px; object-fit:contain; border-radius:6px; background:rgba(255,255,255,0.02); padding:4px;">
          <div class="meta">
            <div style="font-weight:700">${prod.nombre}</div>
            <div class="small">$${prod.precio.toLocaleString()} x ${prod.cantidad}</div>
          </div>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="btn secondary menos" data-id="${prod.id}">-</button>
          <button class="btn secondary mas" data-id="${prod.id}">+</button>
          <button class="btn secondary eliminar" data-id="${prod.id}">Eliminar</button>
        </div>
      `;
      ul.appendChild(li);
    });
  });

  // actualizar total en todos los spans #total
  const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  totalElem.forEach(el => el.innerText = '$' + total.toLocaleString());
}

// Inicializar vista al cargar
actualizarTodasVistas();
