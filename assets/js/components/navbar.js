export function renderNavbar(targetSelector, links) {
  const host = document.querySelector(targetSelector);
  if (!host) return;

  host.className = 'navbar';
  host.innerHTML = `
    <div class="nav-left">
      <button class="menu-btn" aria-expanded="false" aria-controls="menu-list">☰ Menú</button>
      <ul id="menu-list" class="menu-dropdown"></ul>
    </div>
    <a class="brand" href="index.html" aria-label="Inicio">🧰 Ferretería y Pinturería Gallego</a>
    <div class="nav-actions"></div>
  `;

  const ul = host.querySelector('#menu-list');
  const actions = host.querySelector('.nav-actions');
  const btnMenu = host.querySelector('.menu-btn');

  links.forEach(l => {
    if (l.id === 'btnLogout') {
      const a = document.createElement('a');
      a.textContent = l.title;
      a.href = l.href || '#';
      a.id = l.id;
      a.className = 'btn';
      actions.appendChild(a);
    } else {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = l.title;
      a.href = l.href;
      li.appendChild(a);
      ul.appendChild(li);
    }
  });

  btnMenu.addEventListener('click', () => {
    const expanded = btnMenu.getAttribute('aria-expanded') === 'true';
    btnMenu.setAttribute('aria-expanded', String(!expanded));
    ul.classList.toggle('open');
  });
}