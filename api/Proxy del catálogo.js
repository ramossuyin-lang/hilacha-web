// api/datos.js — Proxy del catálogo de la tienda.
//
// El navegador pide /api/datos y Vercel llama al Apps Script por dentro,
// así la URL del Apps Script no aparece en el HTML de la tienda.
// El Apps Script solo se consulta del lado del servidor; el navegador
// nunca recibe su URL.
//
// Comportamiento igual que la llamada directa de antes:
// - Si el Apps Script responde bien, se devuelve su JSON tal cual (200).
// - Si falla, se devuelve 502 y la tienda muestra "No se pudo conectar
//   con el catálogo." como antes.
// - Sin caché (no-store): cada carga trae el stock en vivo.

const API_DATOS = 'https://script.google.com/macros/s/AKfycbyZTODc4hs06UrN6XLkcwXm0AwKrTfpzHaPw1ky7HfHMcOYxPjTUr5qw_RiHoCbpBNabw/exec?action=getDatos';

module.exports = async (req, res) => {
  try {
    const r = await fetch(API_DATOS, { method: 'GET', redirect: 'follow' });
    if (!r.ok) throw new Error('Apps Script HTTP ' + r.status);
    const data = await r.json();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.send(JSON.stringify(data));
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.send(JSON.stringify({ error: 'catalogo_no_disponible' }));
  }
};
