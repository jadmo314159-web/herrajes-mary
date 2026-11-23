# Cierres y Herrajes Mary — catálogo web

Sitio estático (HTML + CSS + JS) sin dependencias. Los productos viven en archivos JSON.

## Ver el sitio
Los módulos JS y los JSON necesitan un servidor local (no funciona abriendo `index.html` con doble clic):

    python -m http.server 8000

y abre http://localhost:8000

## Colores (tomados del logo)
Están en `css/base.css`: rojo `#C4141A`, rojo vivo `#E0161C`, vino `#7A0C0C`, blanco y una tinta vino oscuro para el texto.

## Agregar productos
1. Si es una marca/material nuevo, agrégalo en `data/categorias.json` (cada nodo con `archivo` es una hoja con referencias).
2. Corre `python scripts/generar_indice.py --esqueleto` para crear los JSON que falten.
3. Llena el JSON de la hoja, por ejemplo `data/cremalleras/nylon/eka.json`:

       { "marca": "Eka", "referencias": [
         { "id": "eka-nylon-3", "numero": "3", "nombre": "Cremallera nylon Eka #3",
           "descripcion": "…", "fotos": ["img/productos/cremalleras/nylon/eka/3-1.webp"] } ] }

4. Guarda las fotos en `img/productos/...`, los logos de marca en `img/marcas/` y la foto de cada categoría en `img/categorias/` (nombres en `categorias.json`).
5. Vuelve a correr `python scripts/generar_indice.py` para actualizar el buscador.

Si una foto no existe, el sitio muestra un relleno rojo con la inicial; no se rompe nada.

## Datos del negocio (`data/negocio.json`)
- `whatsapp`: número con indicativo y sin signos, por ejemplo `573001234567`. Si queda vacío, el botón abre WhatsApp y el cliente elige a quién escribir.
- `mision` y `vision`: los textos actuales son de ejemplo, cámbialos por los reales.
- `banners`: imágenes que pasan solas en el inicio (cada 5 s). Guárdalas en `img/banners/`. Se pausan al pasar el mouse, con el botón «Pausar» y si el dispositivo pide menos movimiento.
- `redes`: nombre y enlace de cada red; borra las que no uses.
- `ubicacion`: dirección y horario. Para mostrar el mapa, en Google Maps usa Compartir → Insertar un mapa, copia solo la URL del `src` y pégala en `mapa_embed`.

## Datos del negocio (`data/negocio.json`)
- `whatsapp`: número con indicativo y sin signos, por ejemplo `573001234567`. Si lo dejas vacío, el botón abre WhatsApp para elegir el contacto.
- `mision` y `vision`: los textos del inicio (los que trae son de ejemplo, reemplázalos).
- `banners`: imágenes que pasan solas en el inicio (`imagen` y `texto`); guárdalas en `img/galeria/`. Se pausa al pasar el mouse o con el botón "Pausar".
- `redes`: nombre y enlace de cada red; las que tengan `url` vacía no se muestran.
- `ubicacion`: `direccion`, `horario` y `mapa_embed` (la URL del iframe que da Google Maps en Compartir > Insertar un mapa).
