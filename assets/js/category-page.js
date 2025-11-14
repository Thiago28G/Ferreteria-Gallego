// Script helper para páginas de categorías
export async function initCategoryPage(categorySlug) {
  const categoryPages = {
    'adhesivos-selladores': 'Adhesivos y Selladores',
    'agua': 'Plomería y Agua',
    'herramientas-manuales': 'Herramientas Manuales',
    'herramientas-electricas': 'Herramientas Eléctricas',
    'jardineria': 'Jardinería',
    'pintura': 'Pintura',
    'cerrajeria-herrajes': 'Cerrajería y Herrajes',
    'electricidad-iluminacion': 'Electricidad e Iluminación',
    'seguridad-higiene': 'Seguridad e Higiene',
    'tornilleria-fijaciones': 'Tornillería y Fijaciones',
    'construccion': 'Construcción'
  };

  try {
    const res = await fetch('./assets/js/data/products.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al cargar productos');
    const data = await res.json();
    
    const products = data[categorySlug] || [];
    return products;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

