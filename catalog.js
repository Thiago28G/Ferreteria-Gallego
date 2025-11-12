(function () {
  const STORAGE_KEY = 'pendingCart';

  const DATASET = {
    'construccion': [
      { id:'CEM-25KG', nombre:'Cemento 25kg', precio:5999, img:'img/cemento.png', sku:'CEM-25' },
      { id:'ARENA-M3', nombre:'Arena fina por m³', precio:28999, img:'img/arena.png', sku:'ARF-1M3' },
      { id:'CAL-HID',  nombre:'Cal hidráulica 20kg', precio:8299, img:'img/cal.png', sku:'CAL-20' },
      { id:'LADRILLO-CM', nombre:'Ladrillo común', precio:420, img:'img/ladrillo.png', sku:'LAD-COM' },
    ],
    'pintura': [
      { id:'LATEX-20', nombre:'Látex interior 20L', precio:47999, img:'img/latex.png', sku:'LAT-20' },
      { id:'RODILLO-PRO', nombre:'Rodillo profesional', precio:3999, img:'img/rodillo.png', sku:'ROD-PRO' },
      { id:'PINCELES-SET', nombre:'Set pinceles x5', precio:5999, img:'img/pinceles.png', sku:'PIN-SET' },
    ],
    'electricidad-iluminacion': [
      { id:'CABLE-2X1.5', nombre:'Cable 2x1.5mm 100m', precio:52999, img:'img/cable.png', sku:'CB-2X15' },
      { id:'TOMA-DOBLE', nombre:'Toma doble', precio:2299, img:'img/toma.png', sku:'TOMA-DBL' },
    ],
    'adhesivos-selladores': [],
    'agua': [],
    'cerrajeria-herrajes': [],
    'herramientas-electricas': [],
    'herramientas-manuales': [],
    'jardineria': [],
    'seguridad-higiene': [],
    'tornilleria-fijaciones': []
  };

  const state = { items: load(), category: null };

  function load(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY))||[] }catch{ return [] } }
  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)); }
  function money(n){ try{ return n.toLocaleString('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}) }catch{ return '$'+n } }

  function render(products){
    const grid = document.getElementById('catalogoGrid');
    grid.innerHTML = '';

    if (!products.length){
      grid.innerHTML = `<p style="grid-column:1/-1;color:#6b7280">No hay productos cargados para este rubro.</p>`;
      return;
    }

    products.forEach(p=>{
      const inCart = state.items.find(i=>i.id===p.id);
      const qty = inCart ? inCart.qty : 0;

      const card = document.createElement('article');
      card.className = 'prod-card';
      card.dataset.id = p.id;
      card.innerHTML = `
        <div class="prod-thumb"><img alt="${p.nombre}" src="${p.img}" loading="lazy"></div>
        <div class="prod-body">
          <div>
            <div class="prod-name">${p.nombre}</div>
            <div class="prod-sku">SKU ${p.sku||'-'}</div>
          </div>
          <div class="prod-row">
            <div class="prod-price">${money(p.precio)}</div>
            <div class="qty-wrap">
              <div class="stepper" role="group" aria-label="Cantidad">
                <button type="button" class="dec" aria-label="Restar">−</button>
                <input type="number" class="qty" value="${qty}" min="0" inputmode="numeric" />
                <button type="button" class="inc" aria-label="Sumar">+</button>
              </div>
              <button type="button" class="btn-add add">Agregar</button>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function setQty(product, qty){
    qty = Math.max(0, Number(qty)||0);
    let found = state.items.find(i=>i.id===product.id);

    if (!found && qty>0){
      found = { ...product, qty:0, category: state.category };
      state.items.push(found);
    }
    if (found){
      found.qty = qty;
      if (found.qty===0) state.items = state.items.filter(i=>i.id!==product.id);
    }
    syncSummary(); save();
  }

  function syncSummary(){
    const el = document.getElementById('catalogoSummary');
    const count = state.items.reduce((a,b)=>a+b.qty,0);
    const total = state.items.reduce((a,b)=>a+b.qty*b.precio,0);
    el.textContent = count ? `${count} producto${count!==1?'s':''} — ${money(total)}` : 'Sin productos seleccionados';
  }

  function bindEvents(products){
    const grid = document.getElementById('catalogoGrid');

    grid.addEventListener('click', e=>{
      const card = e.target.closest('.prod-card'); if (!card) return;
      const p = products.find(x=>x.id===card.dataset.id);
      const input = card.querySelector('.qty');
      let current = Number(input.value)||0;

      if (e.target.classList.contains('inc')){ current++; input.value=current; setQty(p,current); }
      if (e.target.classList.contains('dec')){ current=Math.max(0,current-1); input.value=current; setQty(p,current); }
      if (e.target.classList.contains('add')){
        if (current===0){ current=1; input.value=1; }
        setQty(p,current);
        e.target.textContent='Agregado';
        setTimeout(()=> e.target.textContent='Agregar', 900);
      }
    });

    grid.addEventListener('input', e=>{
      if (!e.target.classList.contains('qty')) return;
      const card = e.target.closest('.prod-card');
      const p = products.find(x=>x.id===card.dataset.id);
      setQty(p, e.target.value);
    });

    document.getElementById('btnLimpiar')?.addEventListener('click', ()=>{
      state.items = []; save(); syncSummary(); render(products);
    });

    document.getElementById('btnContinuar')?.addEventListener('click', ()=>{
      save();
      alert('Selección guardada. Luego armamos el carrito.');
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const host = document.querySelector('[data-category]');
    if (!host) return;

    const slug = host.getAttribute('data-category');  // ej: "construccion"
    state.category = slug;

    const products = DATASET[slug] || [];
    render(products); bindEvents(products); syncSummary();
  });
})();
