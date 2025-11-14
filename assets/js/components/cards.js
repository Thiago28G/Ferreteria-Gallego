export function renderProductCards(containerSelector, products = [], onCartUpdate = null) {
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
        ${p.description ? `<div class="prod-description">${p.description}</div>` : ''}

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
          <button class="btn-add" data-id="${p.id}">Agregar al carrito</button>
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

    const btnAdd = card.querySelector('.btn-add[data-id]');
    btnAdd.addEventListener('click', () => {
      const qty = Number(input.value || 1);
      addToCart({ id: p.id, name: p.name, price: p.price, img: p.img }, qty);
      if (onCartUpdate) onCartUpdate();
      
      import('./cart.js').then(({ showCartNotification }) => {
        showCartNotification(p.name, qty);
      });
    });

    const btnDetails = card.querySelector('.btn-ghost');
    if (btnDetails) {
      btnDetails.addEventListener('click', () => {
        showProductModal(p);
      });
    }

    grid.appendChild(card);
  });
}

function showProductModal(product) {
  let modal = document.getElementById('product-modal');
  let overlay = document.getElementById('product-modal-overlay');
  
  if (!modal) {
    overlay = document.createElement('div');
    overlay.id = 'product-modal-overlay';
    overlay.className = 'product-modal-overlay';
    
    modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.className = 'product-modal';
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    overlay.addEventListener('click', closeProductModal);
  }
  
  modal.innerHTML = `
    <button class="product-modal-close" aria-label="Cerrar">×</button>
    <div class="product-modal-image">
      <img src="${product.img || ''}" alt="${product.name || ''}">
    </div>
    <div class="product-modal-content">
      <h2 class="product-modal-title">${product.name || ''}</h2>
      <div class="product-modal-sku">SKU: ${product.sku || '-'}</div>
      ${product.description ? `<p class="product-modal-description">${product.description}</p>` : ''}
      <div class="product-modal-price">$${Number(product.price || 0).toLocaleString('es-AR')}</div>
      <button class="product-modal-add-btn" data-product-id="${product.id}">Agregar al carrito</button>
    </div>
  `;
  
  const closeBtn = modal.querySelector('.product-modal-close');
  closeBtn.addEventListener('click', closeProductModal);
  
  const addBtn = modal.querySelector('.product-modal-add-btn');
  addBtn.addEventListener('click', () => {
    import('./cart.js').then(({ showCartNotification }) => {
      addToCart({ id: product.id, name: product.name, price: product.price, img: product.img }, 1);
      showCartNotification(product.name, 1);
    });
    closeProductModal();
  });
  
  overlay.classList.add('active');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  const overlay = document.getElementById('product-modal-overlay');
  if (modal && overlay) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
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