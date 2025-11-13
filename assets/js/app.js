import { requireAuth, logout } from './auth.js';
import { navLinks } from './data/pages.js';
import { renderNavbar } from './components/navbar.js';
import { renderProductCards } from './components/cards.js';
import { products } from './products/mock-products.js';

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  renderNavbar('#app-header', navLinks);
  const btn = document.getElementById('btnLogout');
  if (btn) btn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  const gridSel = '#productGrid';
  if (document.querySelector(gridSel)) {
    renderProductCards(gridSel, products);
  }
});