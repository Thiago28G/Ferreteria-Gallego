export function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
  catch { return []; }
}

export function setCart(cart) { 
  localStorage.setItem('cart', JSON.stringify(cart)); 
}

export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  setCart(updatedCart);
  updateCartView();
}

export function updateCartView() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  if (!container) return;
  
  const total = cart.reduce((acc, p) => acc + (Number(p.price)||0) * (Number(p.qty)||0), 0);
  const totalItems = cart.reduce((acc, p) => acc + (Number(p.qty)||0), 0);
  
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <div class="empty-cart-text">Tu carrito está vacío</div>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(p => `
      <div class="cart-item" data-product-id="${p.id}">
        <img src="${p.img||''}" alt="${p.name||''}">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name||''}</div>
          <div class="cart-item-qty">Cantidad: ${p.qty||0}</div>
          <div class="cart-item-price">$${((Number(p.price)||0)*(Number(p.qty)||0)).toLocaleString('es-AR')}</div>
        </div>
        <button class="cart-item-remove" data-product-id="${p.id}" aria-label="Eliminar ${p.name||''} del carrito" title="Eliminar">×</button>
      </div>
    `).join('');
    
    container.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = btn.getAttribute('data-product-id');
        if (productId) {
          removeFromCart(productId);
        }
      });
    });
  }
  
  const cartTotalEl = document.getElementById('cartTotal');
  if (cartTotalEl) {
    cartTotalEl.textContent = total.toLocaleString('es-AR');
  }
}

export function openCart() {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    overlay.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

export function closeCart() {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

export function initCart() {
  if (!document.getElementById('cart-overlay')) {
    const body = document.body;
    body.insertAdjacentHTML('beforeend', `
      <div id="cart-overlay" class="cart-overlay"></div>
      <div id="cart-drawer" class="cart-drawer">
        <div class="cart-drawer-header">
          <h2>Tu Pedido</h2>
          <button id="cart-close" class="cart-close" aria-label="Cerrar carrito">×</button>
        </div>
        <div id="cartItems" class="cart-items-container"></div>
        <div class="cart-drawer-footer">
          <div class="cart-total">
            <span class="cart-total-label">Total:</span>
            <span class="cart-total-amount">$<span id="cartTotal">0</span></span>
          </div>
          <div class="cart-actions">
            <button id="clearCart" class="btn-cart-secondary">Vaciar</button>
            <button id="checkout" class="btn-cart-primary">Finalizar Pedido</button>
          </div>
        </div>
      </div>
    `);
  }

  const cartToggle = document.getElementById('cart-toggle');
  const cartClose = document.getElementById('cart-close');
  const cartOverlay = document.getElementById('cart-overlay');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkout');
  
  if (cartToggle) {
    cartToggle.addEventListener('click', openCart);
  }
  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => { 
      setCart([]); 
      updateCartView(); 
    });
  }
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => { 
      const cart = getCart();
      if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
      }
      alert('¡Gracias por tu compra! Tu pedido será preparado para retiro.'); 
      setCart([]); 
      updateCartView();
      closeCart();
    });
  }

  updateCartView();
  window.addEventListener('storage', updateCartView);
}

export function showCartNotification(productName, quantity) {
  let notificationContainer = document.getElementById('cart-notifications');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'cart-notifications';
    notificationContainer.className = 'cart-notifications';
    document.body.appendChild(notificationContainer);
  }

  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <span class="cart-notification-icon">✓</span>
    <span class="cart-notification-text">${productName} × ${quantity} agregado</span>
  `;

  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

