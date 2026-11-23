#!/usr/bin/env python3
"""Une categorias.json y todos los JSON de referencias en data/indice.json (lo usa el buscador).

Uso (desde la carpeta del proyecto):
    python scripts/generar_indice.py              # genera data/indice.json
    python scripts/generar_indice.py --esqueleto  # además crea los JSON y carpetas que falten
"""
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CREAR_ESQUELETO = "--esqueleto" in sys.argv


def leer(ruta: Path):
    return json.loads(ruta.read_text(encoding="utf-8"))


def recorrer(nodos, camino_ids, camino_nombres, indice):
    for n in nodos:
        ids = camino_ids + [n["id"]]
        nombres = camino_nombres + [n["nombre"]]
        ruta = "/".join(ids)
        indice.append({"titulo": n["nombre"], "texto": "", "camino": " › ".join(nombres[:-1]) or "Catálogo", "ruta": ruta})

        if n.get("archivo"):
            archivo = RAIZ / n["archivo"]
            if not archivo.exists():
                if CREAR_ESQUELETO:
                    archivo.parent.mkdir(parents=True, exist_ok=True)
                    archivo.write_text(json.dumps({"referencias": []}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                    print(f"  creado {n['archivo']}")
                else:
                    print(f"  aviso: falta {n['archivo']}")
                    continue
            for r in leer(archivo).get("referencias", []):
                indice.append({
                    "titulo": r["nombre"],
                    "texto": r.get("descripcion", "") + " " + str(r.get("numero", "")),
                    "camino": " › ".join(nombres),
                    "ruta": f"{ruta}/{r['id']}",
                })
        recorrer(n.get("hijos", []), ids, nombres, indice)


def main():
    indice = []
    recorrer(leer(RAIZ / "data" / "categorias.json"), [], [], indice)
    destino = RAIZ / "data" / "indice.json"
    destino.write_text(json.dumps(indice, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"indice.json listo: {len(indice)} entradas")


if __name__ == "__main__":
    main()
