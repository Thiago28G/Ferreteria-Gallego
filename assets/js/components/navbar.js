export function renderNavbar(targetSelector, links) {
  const host = document.querySelector(targetSelector);
  if (!host) return;

  const categoryPages = {
    'adhesivos-selladores': 'categoria-adhesivos-selladores.html',
    'agua': 'categoria-agua.html',
    'herramientas-manuales': 'categoria-herramientas-manuales.html',
    'herramientas-electricas': 'categoria-herramientas-electricas.html',
    'jardineria': 'categoria-jardineria.html',
    'pintura': 'categoria-pintura.html',
    'cerrajeria-herrajes': 'categoria-cerrajeria-herrajes.html',
    'electricidad-iluminacion': 'categoria-electricidad-iluminacion.html',
    'seguridad-higiene': 'categoria-seguridad-higiene.html',
    'tornilleria-fijaciones': 'categoria-tornilleria-fijaciones.html',
    'construccion': 'categoria-construccion.html'
  };

  host.className = 'navbar';
  host.innerHTML = `
    <div class="nav-left">
      <button class="categories-btn" aria-expanded="false" aria-controls="categories-menu">📂 Categorías</button>
      <ul id="categories-menu" class="categories-dropdown"></ul>
    </div>
    <a class="brand" href="index.html" aria-label="Inicio">🧰 Ferretería y Pinturería Gallego</a>
    <div class="nav-actions">
      <button id="cart-toggle" class="cart-icon-btn" aria-label="Ver carrito">
        <span class="cart-icon">🛒</span>
        <span id="cart-badge" class="cart-badge">0</span>
      </button>
    </div>
  `;

  const categoriesUl = host.querySelector('#categories-menu');
  const actions = host.querySelector('.nav-actions');
  const btnCategories = host.querySelector('.categories-btn');

  const categoryLinks = [
    { slug: 'adhesivos-selladores', title: 'Adhesivos y Selladores' },
    { slug: 'agua', title: 'Plomería y Agua' },
    { slug: 'herramientas-manuales', title: 'Herramientas Manuales' },
    { slug: 'herramientas-electricas', title: 'Herramientas Eléctricas' },
    { slug: 'jardineria', title: 'Jardinería' },
    { slug: 'pintura', title: 'Pintura' },
    { slug: 'cerrajeria-herrajes', title: 'Cerrajería y Herrajes' },
    { slug: 'electricidad-iluminacion', title: 'Electricidad e Iluminación' },
    { slug: 'seguridad-higiene', title: 'Seguridad e Higiene' },
    { slug: 'tornilleria-fijaciones', title: 'Tornillería y Fijaciones' },
    { slug: 'construccion', title: 'Construcción' }
  ];

  categoryLinks.forEach(cat => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = cat.title;
    a.href = categoryPages[cat.slug] || '#';
    li.appendChild(a);
    categoriesUl.appendChild(li);
  });

  btnCategories.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = btnCategories.getAttribute('aria-expanded') === 'true';
    btnCategories.setAttribute('aria-expanded', String(!expanded));
    categoriesUl.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!host.contains(e.target)) {
      categoriesUl.classList.remove('open');
      btnCategories.setAttribute('aria-expanded', 'false');
    }
  });

  links.forEach(l => {
    if (l.id === 'btnLogout') {
      const a = document.createElement('a');
      a.textContent = l.title;
      a.href = l.href || '#';
      a.id = l.id;
      a.className = 'btn';
      actions.appendChild(a);
    }
  });
}
