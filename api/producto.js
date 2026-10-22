// Vercel Serverless Function — preview personalizado por producto para WhatsApp/redes.
// Colocar en: <tu-proyecto-vercel>/api/producto.js  (se publica como /api/producto?i=N)
// WhatsApp lee las etiquetas OG de esta respuesta (no ejecuta JavaScript);
// las personas son redirigidas a la ficha del producto en la tienda.

const API_DATOS = 'https://script.google.com/macros/s/AKfycbyZTODc4hs06UrN6XLkcwXm0AwKrTfpzHaPw1ky7HfHMcOYxPjTUr5qw_RiHoCbpBNabw/exec?action=getDatos';
const SITE = 'https://hilacha-web.vercel.app';
const IMG_GENERICA = 'https://i.postimg.cc/B6VcjcNR/1767752107263-removebg-preview.png';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async (req, res) => {
  const i = parseInt((req.query && req.query.i) || '', 10);

  let titulo = 'HILACHA - Pijamas comodas y modernas';
  let descrip = 'Pijamas comodas y modernas en todas las tallas (S a 4XL). Pedidos por WhatsApp con envios a todo el Peru.';
  let imagen = IMG_GENERICA;
  let destino = SITE + '/';

  try {
    const r = await fetch(API_DATOS);
    if (r.ok) {
      const productos = await r.json();
      const p = Array.isArray(productos) ? productos[i] : null;
      if (p) {
        const oferta = p.precioOferta && String(p.precioOferta).trim() !== '';
        const precio = Number(oferta ? p.precioOferta : p.precio) || 0;
        titulo = (p.modelo || 'Pijama HILACHA') + ' - HILACHA';
        descrip = 'Talla ' + (p.talla || 'Unica') + ' - S/. ' + precio.toLocaleString('es-PE') +
                  '. Pedidos por WhatsApp: 924 789 997.';
        if (p.foto) imagen = p.foto;
        destino = SITE + '/?producto=' + i;
      }
    }
  } catch (e) {
    // Si falla la API, se sirve el preview genérico igual.
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=600');
  res.send(
    '<!DOCTYPE html><html lang="es"><head>' +
    '<meta charset="utf-8">' +
    '<title>' + esc(titulo) + '</title>' +
    '<meta property="og:type" content="website">' +
    '<meta property="og:site_name" content="HILACHA">' +
    '<meta property="og:title" content="' + esc(titulo) + '">' +
    '<meta property="og:description" content="' + esc(descrip) + '">' +
    '<meta property="og:url" content="' + esc(destino) + '">' +
    '<meta property="og:image" content="' + esc(imagen) + '">' +
    '<meta name="twitter:card" content="summary_large_image">' +
    '<meta http-equiv="refresh" content="0;url=' + esc(destino) + '">' +
    '</head><body>' +
    '<p>Abriendo <a href="' + esc(destino) + '">HILACHA</a>...</p>' +
    '<script>location.replace(' + JSON.stringify(destino) + ');</script>' +
    '</body></html>'
  );
};
