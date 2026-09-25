# WebGIS Bubuieci

Portal WebGIS al satului Bubuieci (mun. Chișinău): o poveste vizuală cu hărți interactive,
grafice, cronologie și fotografii ale satului.

**🌐 Portal:** https://imefodi.github.io/harta-bubuieci/

**🗺 Hărți interactive tematice** (fiecare doar cu informațiile temei ei):

| Temă | Link |
|---|---|
| Localizare | https://imefodi.github.io/harta-bubuieci/tematice/?t=localizare |
| Utilizarea terenurilor | https://imefodi.github.io/harta-bubuieci/tematice/?t=terenuri |
| Fondul construit (cadastru) | https://imefodi.github.io/harta-bubuieci/tematice/?t=cladiri |
| Servicii și transport | https://imefodi.github.io/harta-bubuieci/tematice/?t=servicii |
| Infrastructura | https://imefodi.github.io/harta-bubuieci/tematice/?t=infrastructura |

**Harta completă (qgis2web / Leaflet):** https://imefodi.github.io/harta-bubuieci/harta/
**Harta QGIS Cloud:** https://qgiscloud.com/Eduard_Iftodii/bubuieci_webgis/

## Structură

| Cale | Conținut |
|---|---|
| `index.html`, `assets/` | portalul (RO/EN, mod luminos/întunecat) |
| `tematice/` | vizualizatorul de hărți tematice (Leaflet) + datele GeoJSON în `tematice/data/` |
| `harta/` | harta completă exportată din QGIS cu qgis2web |

## Date

© OpenStreetMap contributors · registrul cadastral, sectorul 0142 · Copernicus CORINE Land Cover ·
INDS / geodata.gov.md · Fotografii: Wikimedia Commons (VictorCiobanu, Gikü — CC0;
Alexander Murvanidze — CC BY-SA 3.0).

---
Autor: Iftodii Eduard, gr. IGC-223 F/R · Coordonator: conf. univ. dr. Sîrbu Rodica
