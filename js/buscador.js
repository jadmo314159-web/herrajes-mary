// Búsqueda instantánea sobre data/indice.json (sin tildes ni mayúsculas).

const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function iniciarBuscador(input, lista, indice) {
  const datos = indice.map(e => ({ ...e, _t: norm([e.titulo, e.texto, e.camino].join(' ')) }));
  let activo = -1;

  const cerrar = () => { lista.hidden = true; input.setAttribute('aria-expanded', 'false'); activo = -1; };
  const marcar = i => {
    const items = [...lista.querySelectorAll('a')];
    items.forEach((a, n) => a.setAttribute('aria-selected', String(n === i)));
    activo = i;
  };

  function buscar() {
    const palabras = norm(input.value).split(/\s+/).filter(Boolean);
    lista.replaceChildren();
    if (!palabras.length) return cerrar();

    const hallados = datos.filter(e => palabras.every(p => e._t.includes(p))).slice(0, 8);
    if (!hallados.length) {
      const li = document.createElement('li');
      li.className = 'buscador__vacio';
      li.textContent = 'No hay resultados. Prueba con otra palabra.';
      lista.append(li);
    }
    for (const e of hallados) {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      const a = document.createElement('a');
      a.href = '#/' + e.ruta;
      const t = document.createElement('span'); t.className = 'buscador__titulo'; t.textContent = e.titulo;
      const c = document.createElement('span'); c.className = 'buscador__camino'; c.textContent = e.camino;
      a.append(t, c);
      a.addEventListener('click', () => { input.value = ''; cerrar(); });
      li.append(a);
      lista.append(li);
    }
    lista.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    activo = -1;
  }

  input.addEventListener('input', buscar);
  input.addEventListener('keydown', ev => {
    const items = [...lista.querySelectorAll('a')];
    if (ev.key === 'Escape') { input.value = ''; cerrar(); }
    else if (ev.key === 'ArrowDown' && items.length) { ev.preventDefault(); marcar((activo + 1) % items.length); }
    else if (ev.key === 'ArrowUp' && items.length) { ev.preventDefault(); marcar((activo - 1 + items.length) % items.length); }
    else if (ev.key === 'Enter' && items.length) { ev.preventDefault(); items[Math.max(activo, 0)].click(); location.hash = items[Math.max(activo, 0)].getAttribute('href'); }
  });
  document.addEventListener('click', ev => { if (!ev.target.closest('.buscador')) cerrar(); });
}
