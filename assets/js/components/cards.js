export function renderProductCards(containerSelector, products = []) {
  const grid = document.querySelector(containerSelector);
  if (!grid) return;
  grid.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'prod-card';

    card.innerHTML = `
      <div class="prod-thumb">
        <img src="${p.img}" alt="${p.name}">
      </div>

      <div class="prod-body">
        <div class="prod-name">${p.name}</div>
        <div class="prod-sku">SKU: ${p.sku}</div>

        <div class="prod-row">
          <div class="prod-price">$ ${Number(p.price).toLocaleString('es-AR')}</div>

          <div class="qty-wrap">
            <div class="stepper" data-id="${p.id}">
              <button class="dec" aria-label="Disminuir">−</button>
              <input class="qty" type="number" min="1" value="1" inputmode="numeric">
              <button class="inc" aria-label="Aumentar">+</button>
            </div>
          </div>
        </div>

        <div class="prod-row">
          <button class="btn-add" data-id="${p.id}">Agregar</button>
          <button class="btn-add btn-ghost">Detalles</button>
        </div>
      </div>
    `;

    const stepper = card.querySelector('.stepper');
    const input   = card.querySelector('.qty');
    stepper.querySelector('.inc').addEventListener('click', () => {
      input.value = String(Number(input.value || 1) + 1);
    });
    stepper.querySelector('.dec').addEventListener('click', () => {
      input.value = String(Math.max(1, Number(input.value || 1) - 1));
    });

    card.querySelector('.btn-add').addEventListener('click', () => {
      const qty = Number(input.value || 1);
      addToCart({ id: p.id, name: p.name, price: p.price, img: p.img }, qty);
      alert(`Agregado: ${p.name} × ${qty}`);
    });

    grid.appendChild(card);
  });
}

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }
export function addToCart(product, qty = 1) {
  const cart = getCart();
  const i = cart.findIndex(it => it.id === product.id);
  if (i >= 0) cart[i].qty += qty; else cart.push({ ...product, qty });
  saveCart(cart);
}