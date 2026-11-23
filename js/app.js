// Arranque y navegación por hash: #/categoria/subcategoria/marca/referencia
import { barraNav, vistaNodos, vistaReferencias, vistaInicio, contenidoPie, mensaje } from './render.js';
import { iniciarBuscador } from './buscador.js';

const vista = document.getElementById('vista');
let arbol = [];
let negocio = {};

async function cargarJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return r.json();
}

// Recorre el árbol hasta agotar los ids o llegar a una hoja (nodo con "archivo")
function resolver(ids) {
  let lista = arbol; const camino = []; let i = 0;
  for (; i < ids.length; i++) {
    const n = (lista || []).find(x => x.id === ids[i]);
    if (!n) return { camino, error: true };
    camino.push(n);
    lista = n.hijos;
    if (n.archivo) { i++; break; }
  }
  return { camino, resto: ids.slice(i), error: false };
}

async function mostrar() {
  const ids = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const { camino, resto, error } = resolver(ids);
  vista.replaceChildren();

  if (error) {
    vista.append(mensaje('No encontramos esa página.', 'Volver al inicio'));
    document.title = 'Cierres y Herrajes Mary';
    return;
  }

  const nodo = camino.at(-1) || null;
  const rutaDe = lista => lista.map(n => n.id).join('/');
  const tramos = [{ nombre: 'Inicio', ruta: '' }, ...camino.map((n, i) => ({ nombre: n.nombre, ruta: rutaDe(camino.slice(0, i + 1)) }))];
  if (nodo) vista.append(barraNav(tramos));

  if (!nodo) {
    vista.append(vistaInicio(negocio), vistaNodos(null, arbol, ''));
  } else if (nodo.archivo) {
    try {
      vista.append(vistaReferencias(nodo, await cargarJSON(nodo.archivo), negocio, camino.map(n => n.nombre).join(' › ')));
    } catch {
      vista.append(mensaje('No se pudo cargar esta sección. Revisa que el archivo exista: ' + nodo.archivo));
    }
    // Botón de volver también al final, para no tener que subir en listas largas
    vista.append(barraNav(tramos).firstElementChild.cloneNode(true));
    const destino = resto[0] && document.getElementById('ref-' + resto[0]);
    if (destino) { destino.classList.add('resaltada'); destino.scrollIntoView({ block: 'center' }); document.title = nodo.nombre + ' · Cierres y Herrajes Mary'; return; }
  } else {
    vista.append(vistaNodos(nodo, nodo.hijos || [], rutaDe(camino)));
  }

  document.title = (nodo ? nodo.nombre + ' · ' : '') + 'Cierres y Herrajes Mary';
  window.scrollTo({ top: 0 });
}

async function iniciar() {
  try { negocio = await cargarJSON('data/negocio.json'); } catch { /* el sitio funciona sin estos datos */ }
  document.getElementById('pie').replaceChildren(...contenidoPie(negocio));
  try {
    arbol = await cargarJSON('data/categorias.json');
  } catch {
    vista.replaceChildren(mensaje('No se pudo cargar el catálogo. Abre el sitio con un servidor local (ver README).'));
    return;
  }
  window.addEventListener('hashchange', mostrar);
  mostrar();
  try {
    iniciarBuscador(document.getElementById('q'), document.getElementById('resultados'), await cargarJSON('data/indice.json'));
  } catch {
    document.getElementById('q').disabled = true;
    document.getElementById('q').placeholder = 'Buscador no disponible: falta data/indice.json';
  }
}
iniciar();
