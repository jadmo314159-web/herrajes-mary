// Dibuja categorías, marcas, referencias, inicio (misión, visión, banner) y pie. Todo el texto entra con textContent.

export function h(tag, props = {}, ...hijos) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const c of hijos.flat()) if (c != null) el.append(c);
  return el;
}

export function foto(src, alt, inicial, etiqueta = '') {
  const caja = h('div', { class: 'foto' });
  const respaldo = () => {
    caja.classList.add('sin-foto');
    caja.append(h('span', { 'aria-hidden': 'true' }, inicial));
    if (etiqueta) caja.append(h('small', {}, etiqueta));
  };
  if (!src) { respaldo(); return caja; }
  const img = h('img', { src, alt, loading: 'lazy' });
  img.addEventListener('error', () => { img.remove(); respaldo(); });
  caja.append(img);
  return caja;
}

export function migas(tramos) {
  // tramos: [{nombre, ruta}] — el último no es enlace
  const nav = h('nav', { class: 'migas', 'aria-label': 'Ruta de navegación' });
  tramos.forEach((t, i) => {
    if (i > 0) nav.append(h('span', { 'aria-hidden': 'true' }, '/'));
    nav.append(i < tramos.length - 1
      ? h('a', { href: '#/' + t.ruta }, t.nombre)
      : h('span', { 'aria-current': 'page' }, t.nombre));
  });
  return nav;
}

export function barraNav(tramos) {
  const barra = h('div', { class: 'barra-nav' });
  if (tramos.length > 1) {
    const anterior = tramos[tramos.length - 2];
    barra.append(h('a', { class: 'volver', href: '#/' + anterior.ruta },
      anterior.ruta ? 'Volver a ' + anterior.nombre : 'Volver al inicio'));
  }
  barra.append(migas(tramos));
  return barra;
}

export function vistaNodos(nodo, hijos, rutaBase) {
  const frag = document.createDocumentFragment();
  frag.append(
    h(nodo ? 'h1' : 'h2', { class: 'titulo-vista' }, nodo ? nodo.nombre : 'Catálogo'),
    h('p', { class: 'subtitulo' }, nodo
      ? 'Elige una opción para ver las referencias disponibles.'
      : 'Cierres, deslizadores, herrajes y todo lo que necesitas para marroquinería.')
  );
  const lista = h('ul', { class: 'rejilla' });
  for (const n of hijos) {
    const esMarca = Boolean(n.logo);
    lista.append(h('li', {},
      h('a', { class: 'tarjeta' + (esMarca ? ' tarjeta--marca' : ''), href: '#/' + [rutaBase, n.id].filter(Boolean).join('/') },
        foto(n.logo || n.imagen, esMarca ? 'Logo de ' + n.nombre : '', n.nombre.charAt(0)),
        h('span', { class: 'tarjeta__nombre' }, n.nombre))));
  }
  frag.append(lista);
  return frag;
}

export function vistaReferencias(nodo, datos, negocio = {}, caminoTexto = '') {
  const frag = document.createDocumentFragment();
  frag.append(h('h1', { class: 'titulo-vista' }, nodo.nombre));
  const refs = datos.referencias || [];
  if (!refs.length) {
    frag.append(h('p', { class: 'estado' }, 'Aún no hay referencias cargadas en esta sección.'));
    return frag;
  }
  frag.append(h('p', { class: 'subtitulo' }, refs.length + (refs.length === 1 ? ' referencia' : ' referencias')));
  for (const r of refs) {
    const fotos = (r.fotos && r.fotos.length) ? r.fotos : [null];
    frag.append(h('article', { class: 'referencia', id: 'ref-' + r.id },
      h('div', { class: 'referencia__cabeza' },
        r.numero ? h('span', { class: 'referencia__num' }, '#' + r.numero) : null,
        h('h2', {}, r.nombre)),
      h('div', { class: 'carrusel', tabindex: '0', role: 'group', 'aria-label': 'Fotos de ' + r.nombre },
        fotos.map(f => foto(f, r.nombre, r.numero ? '#' + r.numero : r.nombre.charAt(0), 'Foto pendiente'))),
      r.descripcion ? h('p', { class: 'referencia__texto' }, r.descripcion) : null,
      botonWhatsapp(negocio.whatsapp, `Hola, quiero cotizar la referencia "${r.nombre}" (${caminoTexto}).`)));
  }
  return frag;
}

export function mensaje(texto, enlace) {
  return h('p', { class: 'estado' }, texto + ' ', enlace ? h('a', { href: '#/' }, enlace) : null);
}

// ===== WhatsApp =====
function icono(d) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', '20'); svg.setAttribute('height', '20');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d); path.setAttribute('fill', 'currentColor');
  svg.append(path);
  return svg;
}
const BURBUJA = 'M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2z';

export function enlaceWhatsapp(numero, texto) {
  // Sin número, wa.me abre WhatsApp para que el cliente elija el contacto
  return `https://wa.me/${(numero || '').replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`;
}
function botonWhatsapp(numero, texto) {
  return h('a', { class: 'btn-whatsapp', href: enlaceWhatsapp(numero, texto), target: '_blank', rel: 'noopener' },
    icono(BURBUJA), 'Cotizar por WhatsApp');
}

// ===== Inicio: misión, visión y banner =====
export function vistaInicio(negocio) {
  const frag = document.createDocumentFragment();
  frag.append(h('h1', { class: 'visible-lector' }, 'Cierres y Herrajes Mary'));
  if (negocio.mision || negocio.vision) {
    frag.append(h('section', { class: 'identidad' },
      negocio.mision ? h('article', { class: 'identidad__item' }, h('h2', {}, 'Misión'), h('p', {}, negocio.mision)) : null,
      negocio.vision ? h('article', { class: 'identidad__item' }, h('h2', {}, 'Visión'), h('p', {}, negocio.vision)) : null));
  }
  if (negocio.banners && negocio.banners.length) frag.append(banner(negocio.banners));
  return frag;
}

function banner(slides) {
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cont = h('section', { class: 'banner', 'aria-roledescription': 'carrusel', 'aria-label': 'Imágenes del almacén' });
  const items = slides.map((s, i) => h('div', {
      class: 'banner__slide' + (i === 0 ? ' activo' : ''), role: 'group', 'aria-roledescription': 'diapositiva',
      'aria-label': `${i + 1} de ${slides.length}`, 'aria-hidden': String(i !== 0) },
    foto(s.imagen, s.texto || '', ''),
    s.texto ? h('p', { class: 'banner__texto' }, s.texto) : null));
  const puntos = slides.map((s, i) => h('button', { class: 'banner__punto', type: 'button', 'aria-label': 'Ir a la imagen ' + (i + 1), onclick: () => ir(i, true) }));
  const pausa = h('button', { class: 'banner__pausa', type: 'button', onclick: () => alternar() }, reducido ? 'Reproducir' : 'Pausar');
  let actual = 0, activo = !reducido, timer = null;

  function ir(n, manual) {
    items[actual].classList.remove('activo'); items[actual].setAttribute('aria-hidden', 'true');
    actual = (n + items.length) % items.length;
    items[actual].classList.add('activo'); items[actual].setAttribute('aria-hidden', 'false');
    puntos.forEach((p, i) => p.setAttribute('aria-current', String(i === actual)));
    if (manual) reiniciar();
  }
  function reiniciar() { clearInterval(timer); if (activo && items.length > 1) timer = setInterval(() => cont.isConnected ? ir(actual + 1) : clearInterval(timer), 5000); }
  function alternar() { activo = !activo; pausa.textContent = activo ? 'Pausar' : 'Reproducir'; reiniciar(); }

  cont.addEventListener('mouseenter', () => clearInterval(timer));
  cont.addEventListener('mouseleave', reiniciar);
  cont.addEventListener('focusin', () => clearInterval(timer));
  cont.addEventListener('focusout', reiniciar);
  cont.append(...items, h('div', { class: 'banner__mando' }, items.length > 1 ? puntos : null, items.length > 1 ? pausa : null));
  ir(0); reiniciar();
  return cont;
}

// ===== Pie: redes y ubicación =====
export function contenidoPie(negocio) {
  const u = negocio.ubicacion || {};
  const consulta = encodeURIComponent(u.direccion || '');
  const redes = (negocio.redes || []).filter(r => r.url);
  return [
    h('div', { class: 'pie__fila' },
      h('div', { class: 'pie__bloque' },
        h('div', { class: 'pie__marca' }, h('img', { src: 'img/logo/logo-192.png', alt: '', width: '44', height: '44' }), h('strong', {}, 'Cierres y Herrajes Mary')),
        h('p', {}, 'Cierres, herrajes e insumos para marroquinería.'),
        h('a', { class: 'btn-whatsapp', href: enlaceWhatsapp(negocio.whatsapp, 'Hola, quiero información sobre sus productos.'), target: '_blank', rel: 'noopener' }, icono(BURBUJA), 'Escríbenos por WhatsApp')),
      redes.length ? h('div', { class: 'pie__bloque' }, h('h2', {}, 'Síguenos'),
        h('ul', { class: 'redes' }, redes.map(r => h('li', {}, h('a', { href: r.url, target: '_blank', rel: 'noopener' }, r.nombre))))) : null,
      h('div', { class: 'pie__bloque' }, h('h2', {}, 'Visítanos'),
        u.direccion ? h('p', {}, u.direccion) : null,
        u.horario ? h('p', {}, u.horario) : null,
        u.direccion ? h('a', { class: 'pie__enlace', href: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.930436235246!2d-77.280675!3d1.20878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2ed49b7d59ad0b%3A0xd2b44a5d4d7f3e96!2sCierres%20y%20Herrajes%20Mary!5e0!3m2!1ses!2sco!4v1795391001946!5m2!1ses!2sco" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>' + consulta, target: '_blank', rel: 'noopener' }, 'Abrir en Google Maps') : null),
      h('div', { class: 'pie__mapa' }, u.mapa_embed
        ? h('iframe', { src: u.mapa_embed, title: 'Mapa con la ubicación del almacén', loading: 'lazy', referrerpolicy: 'no-referrer-when-downgrade' })
        : h('p', {}, 'Aquí aparecerá el mapa de la ubicación.'))),
    h('p', { class: 'pie__legal' }, '© ' + new Date().getFullYear() + ' Cierres y Herrajes Mary')
  ];
}
