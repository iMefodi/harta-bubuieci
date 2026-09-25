/* Harti interactive tematice — WebGIS Bubuieci
 * Parametri URL: ?t=localizare|terenuri|cladiri|servicii|infrastructura  &embed=1  &lang=ro|en
 * Datele: data/*.geojson (generate de lab_4/genereaza_date_tematice.sh)
 */
(function () {
  'use strict';

  var P = new URLSearchParams(location.search);
  var THEMES_ORDER = ['localizare', 'terenuri', 'cladiri', 'servicii', 'infrastructura'];
  var THEME = THEMES_ORDER.indexOf(P.get('t')) >= 0 ? P.get('t') : 'localizare';
  var EMBED = P.get('embed') === '1';
  var lang = P.get('lang');
  if (!lang) { try { lang = localStorage.getItem('lang'); } catch (e) { lang = null; } }
  lang = lang === 'en' ? 'en' : 'ro';
  if (EMBED) document.body.classList.add('embed');
  if (P.get('nofull') === '1') document.body.classList.add('nofull');   // portalul are deja butonul lui

  // ------------------------------------------------------------------ texte
  var UI = {
    ro: {
      hide: 'Ascunde', show: 'Legendă', loading: 'Se încarcă datele…', full: 'Ecran complet ↗',
      bMap: 'Hartă', bMuted: 'Estompat', bOrto: 'Ortofoto', search: 'Caută după nume sau tip…',
      hintCat: 'Click pe o categorie pentru a o ascunde sau afișa.',
      area: 'Suprafață', len: 'Lungime', name: 'Nume', type: 'Tip', cad: 'Cod cadastral', house: 'Nr. casă',
      use: 'Destinație', letter: 'Litera', addr: 'Adresă', hours: 'Program', phone: 'Telefon', web: 'Site',
      shelter: 'Adăpost', yes: 'da', no: 'nu', sport: 'Sport', operator: 'Operator', pop: 'Populație',
      men: 'Bărbați', women: 'Femei', parcel: 'Teren (parcelă)', building: 'Clădire', other: 'Altele',
      unspecified: 'Nespecificat', inh: 'locuitori', boundary: 'Limita satului Bubuieci',
      gBuild: 'Clădiri', gParcels: 'Terenuri (parcele)', gLand: 'Utilizarea terenurilor', gWater: 'Ape',
      gRoads: 'Drumuri', gPower: 'Energie electrică', gTransport: 'Transport public', gLeisure: 'Agrement',
      gHeritage: 'Patrimoniu', gLeisureZones: 'Zone de agrement', lines: 'Linii electrice',
      substations: 'Posturi de transformare', wpoly: 'Suprafețe de apă'
    },
    en: {
      hide: 'Hide', show: 'Legend', loading: 'Loading data…', full: 'Full screen ↗',
      bMap: 'Map', bMuted: 'Muted', bOrto: 'Orthophoto', search: 'Search by name or type…',
      hintCat: 'Click a category to hide or show it.',
      area: 'Area', len: 'Length', name: 'Name', type: 'Type', cad: 'Cadastral code', house: 'House no.',
      use: 'Use', letter: 'Letter', addr: 'Address', hours: 'Opening hours', phone: 'Phone', web: 'Website',
      shelter: 'Shelter', yes: 'yes', no: 'no', sport: 'Sport', operator: 'Operator', pop: 'Population',
      men: 'Men', women: 'Women', parcel: 'Land parcel', building: 'Building', other: 'Other',
      unspecified: 'Unspecified', inh: 'inhabitants', boundary: 'Bubuieci village boundary',
      gBuild: 'Buildings', gParcels: 'Land parcels', gLand: 'Land use', gWater: 'Water',
      gRoads: 'Roads', gPower: 'Electricity', gTransport: 'Public transport', gLeisure: 'Leisure',
      gHeritage: 'Heritage', gLeisureZones: 'Leisure areas', lines: 'Power lines',
      substations: 'Substations', wpoly: 'Water surfaces'
    }
  };
  function u(k) { return UI[lang][k] || UI.ro[k] || k; }

  var THEME_TXT = {
    localizare: {
      ro: ['Localizare', 'Bubuieci în municipiul Chișinău · 2 770 ha · 7 617 locuitori', 'Surse: limita satului — INDS (geodata.gov.md); populația — BNS.'],
      en: ['Location', 'Bubuieci in Chișinău Municipality · 2,770 ha · 7,617 inhabitants', 'Sources: village boundary — NSDI (geodata.gov.md); population — NBS.']
    },
    terenuri: {
      ro: ['Utilizarea terenurilor', 'Click pe o zonă pentru tip și suprafață', 'Sursa: © OpenStreetMap contributors (landuse), 2026.'],
      en: ['Land use', 'Click an area to see its type and size', 'Source: © OpenStreetMap contributors (landuse), 2026.']
    },
    cladiri: {
      ro: ['Fondul construit', '5 868 clădiri și 10 165 terenuri din cadastru', 'Sursa: registrul cadastral, sectorul 0142.'],
      en: ['Built-up area', '5,868 buildings and 10,165 parcels from the cadastre', 'Source: cadastral register, sector 0142.']
    },
    servicii: {
      ro: ['Servicii și transport', '109 puncte de interes · 88 stații · locuri de agrement', 'Sursa: © OpenStreetMap contributors, 2026.'],
      en: ['Services and transport', '109 points of interest · 88 stops · leisure places', 'Source: © OpenStreetMap contributors, 2026.']
    },
    infrastructura: {
      ro: ['Infrastructura', 'Drumuri, ape și rețeaua electrică', 'Sursa: © OpenStreetMap contributors, 2026.'],
      en: ['Infrastructure', 'Roads, water and the power network', 'Source: © OpenStreetMap contributors, 2026.']
    }
  };

  // denumiri pe categorii (RO); in EN se folosesc suprascrierile sau eticheta OSM umanizata
  var RO = {
    land: { residential: 'Zonă rezidențială', farmland: 'Teren arabil', allotments: 'Loturi și grădini', farmyard: 'Curți agricole',
      commercial: 'Comercial', industrial: 'Industrial', retail: 'Comerț', garages: 'Garaje', forest: 'Pădure', wood: 'Pădure',
      meadow: 'Pajiște', grass: 'Spațiu verde', grassland: 'Pajiște', park: 'Parc', vineyard: 'Vie', orchard: 'Livadă',
      quarry: 'Carieră', religious: 'Lăcaș de cult', landfill: 'Depozit de deșeuri', construction: 'Șantier',
      cemetery: 'Cimitir', military: 'Militar', brownfield: 'Teren dezafectat', railway: 'Cale ferată',
      recreation_ground: 'Teren de agrement', basin: 'Bazin', reservoir: 'Rezervor' },
    road: { tertiary: 'Drum local', residential: 'Stradă', living_street: 'Stradă rezidențială', unclassified: 'Drum neclasificat',
      service: 'Drum de acces', track: 'Drum de câmp', path: 'Potecă', footway: 'Trotuar / alee', steps: 'Scări',
      cycleway: 'Pistă de biciclete', proposed: 'Drum proiectat', construction: 'Drum în construcție',
      primary: 'Drum principal', secondary: 'Drum secundar' },
    water: { water: 'Luciu de apă', reservoir: 'Rezervor', wastewater: 'Bazin de epurare', pond: 'Iaz', basin: 'Bazin',
      river: 'Râu', stream: 'Pârâu', ditch: 'Șanț', drain: 'Canal de drenaj', dam: 'Baraj', canal: 'Canal' },
    power: { line: 'Linie de înaltă tensiune', minor_line: 'Linie de medie / joasă tensiune', substation: 'Post de transformare',
      plant: 'Centrală electrică', generator: 'Generator' },
    poi: { bench: 'Bancă', parking: 'Parcare', payment_terminal: 'Terminal de plată', cafe: 'Cafenea', pharmacy: 'Farmacie',
      fast_food: 'Fast-food', waste_disposal: 'Colectare deșeuri', fuel: 'Benzinărie', restaurant: 'Restaurant',
      post_office: 'Oficiu poștal', police: 'Poliție', post_box: 'Cutie poștală', bus_station: 'Autogară',
      clinic: 'Centru medical', recycling: 'Reciclare', charging_station: 'Stație de încărcare', car_wash: 'Spălătorie auto',
      bar: 'Bar', events_venue: 'Sală de evenimente', library: 'Bibliotecă', convenience: 'Magazin alimentar',
      car_repair: 'Service auto', butcher: 'Măcelărie', tyres: 'Vulcanizare', supermarket: 'Supermarket',
      tailor: 'Croitorie', hairdresser: 'Frizerie / coafură', car_parts: 'Piese auto', hardware: 'Materiale de construcții',
      chemist: 'Drogherie', clothes: 'Haine', bakery: 'Brutărie', florist: 'Florărie', paint: 'Vopsele',
      alcohol: 'Băuturi', motorcycle_repair: 'Service moto', garden_centre: 'Articole de grădină', coffee: 'Cafea',
      picnic_site: 'Loc de picnic', artwork: 'Operă de artă', attraction: 'Atracție', dentist: 'Cabinet stomatologic',
      doctors: 'Cabinet medical', parking_entrance: 'Intrare parcare', bureau_de_change: 'Schimb valutar',
      variety_store: 'Magazin universal', toys: 'Jucării', pet: 'Articole pentru animale', water: 'Apă potabilă',
      farm: 'Fermă', furniture: 'Mobilă' },
    transport: { bus_stop: 'Stație de autobuz', stop_position: 'Punct de oprire', platform: 'Peron', station: 'Gară',
      bus_station: 'Autogară' },
    leisure: { playground: 'Loc de joacă', pitch: 'Teren de sport', swimming_pool: 'Piscină', fitness_centre: 'Sală de fitness',
      fitness_station: 'Fitness în aer liber', garden: 'Grădină', park: 'Parc', sports_centre: 'Complex sportiv',
      stadium: 'Stadion', track: 'Pistă' },
    sport: { soccer: 'fotbal', basketball: 'baschet', tennis: 'tenis', volleyball: 'volei', multi: 'multisport',
      swimming: 'înot', fitness: 'fitness', athletics: 'atletism', table_tennis: 'tenis de masă' },
    historic: { memorial: 'Monument comemorativ', war_memorial: 'Monument al eroilor de război' }
  };
  var EN = {
    land: { farmland: 'Farmland', allotments: 'Allotments and gardens', farmyard: 'Farmyards', grass: 'Green space', brownfield: 'Brownfield', residential: 'Residential' },
    road: { tertiary: 'Local road', residential: 'Street', living_street: 'Living street', unclassified: 'Unclassified road',
      service: 'Service road', track: 'Field track', footway: 'Footway', proposed: 'Proposed road', construction: 'Road under construction' },
    water: { water: 'Water surface', wastewater: 'Wastewater basin', drain: 'Drainage canal' },
    power: { line: 'High-voltage line', minor_line: 'Medium / low-voltage line', plant: 'Power plant' },
    poi: { convenience: 'Grocery store', car_repair: 'Car repair', hardware: 'Building materials', chemist: 'Drugstore',
      events_venue: 'Events venue', water: 'Drinking water', variety_store: 'Variety store', bureau_de_change: 'Currency exchange' },
    transport: { stop_position: 'Stop position' },
    leisure: { pitch: 'Sports pitch', fitness_station: 'Outdoor fitness' },
    sport: {},
    historic: { memorial: 'Memorial', war_memorial: 'War memorial' }
  };
  function humanize(s) { s = String(s).replace(/_/g, ' '); return s.charAt(0).toUpperCase() + s.slice(1); }
  function lbl(ctx, tag) {
    if (tag === null || tag === undefined || tag === '') return u('other');
    var d = lang === 'ro' ? RO[ctx] : EN[ctx];
    return (d && d[tag]) || humanize(tag);
  }

  // ------------------------------------------------------------------ utilitare
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(n, dec) {
    var s = Number(n).toLocaleString(lang === 'ro' ? 'ro-RO' : 'en-GB', { maximumFractionDigits: dec || 0, minimumFractionDigits: 0 });
    return lang === 'ro' ? s.replace(/\./g, ' ') : s;    // 10 165 (ca in restul portalului)
  }
  function area(ha) {
    if (ha === null || ha === undefined) return null;
    return ha < 1 ? num(ha * 10000) + ' m²' : num(ha, 2) + ' ha';
  }
  function length(m) {
    if (m === null || m === undefined) return null;
    return m >= 1000 ? num(m / 1000, 2) + ' km' : num(m) + ' m';
  }
  // textul din registru are diacritice citite gresit (cp1251): г→ă, є→ș, ю→ț ...
  function fixText(s) {
    if (!s) return s;
    var m = { 'г': 'ă', 'Г': 'Ă', 'є': 'ș', 'Є': 'Ș', 'ю': 'ț', 'Ю': 'Ț', 'о': 'o', 'в': '' };
    s = s.replace(/[гГєЄюЮов]/g, function (c) { return m[c]; }).trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function popup(kicker, title, rows) {
    var h = '<div class="pp">';
    if (kicker) h += '<div class="pp-k">' + esc(kicker) + '</div>';
    h += '<div class="pp-t">' + esc(title) + '</div><table>';
    rows.forEach(function (r) {
      if (r[1] === null || r[1] === undefined || r[1] === '') return;
      h += '<tr><td>' + esc(r[0]) + '</td><td>' + (r[2] ? r[1] : esc(r[1])) + '</td></tr>';
    });
    return h + '</table></div>';
  }

  // ------------------------------------------------------------------ harta
  var map = L.map('map', { zoomControl: false, preferCanvas: true, minZoom: 10, maxZoom: 19 }).setView([46.978, 28.955], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);
  map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');

  // panouri (ordinea de desenare) + un renderer canvas pentru fiecare
  [['polys', 400], ['casing', 415], ['lines', 420], ['outline', 430], ['pts', 610]].forEach(function (p) {
    map.createPane(p[0]).style.zIndex = p[1];
  });
  var R = {};
  ['polys', 'casing', 'lines', 'outline', 'pts'].forEach(function (p) { R[p] = L.canvas({ pane: p, padding: 0.5, tolerance: 4 }); });
  map.getPane('outline').style.pointerEvents = 'none';

  var BASE = {
    map: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
    orto: L.tileLayer.wms('https://geodata.gov.md/geoserver/orthophoto/wms', {
      layers: 'orthophoto:2020_ortofoto_moldova_centru', format: 'image/jpeg', version: '1.1.1', maxZoom: 19,
      attribution: 'Ortofoto 2020 © AGCC / <a href="https://inds.gov.md/">INDS</a>'
    })
  };
  var baseMode = THEME === 'localizare' ? 'map' : 'muted';
  function setBase(mode) {
    baseMode = mode;
    var layer = mode === 'orto' ? BASE.orto : BASE.map;
    var other = mode === 'orto' ? BASE.map : BASE.orto;
    if (map.hasLayer(other)) map.removeLayer(other);
    if (!map.hasLayer(layer)) layer.addTo(map);
    map.getContainer().classList.toggle('muted', mode === 'muted');
    document.querySelectorAll('#base button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-b') === mode); });
  }

  // embed: rotita mouse-ului nu fura derularea paginii pana la primul click pe harta
  if (EMBED) {
    map.scrollWheelZoom.disable();
    map.once('click', function () { map.scrollWheelZoom.enable(); });
  }

  var cache = {};
  function load(file) {
    if (!cache[file]) cache[file] = fetch('data/' + file + '.geojson').then(function (r) { return r.json(); });
    return cache[file];
  }

  // ------------------------------------------------------------------ stiluri tematice
  // paleta pentru web: fiecare categorie usor de deosebit pe fundalul estompat
  var LAND_C = { farmland: '#F6E3A1', residential: '#D9D4CE', forest: '#7FBF7F', wood: '#7FBF7F', allotments: '#E6CE8E',
    meadow: '#C9E6A3', grassland: '#C9E6A3', orchard: '#9ED27A', vineyard: '#B99AD9', brownfield: '#C7B8A2',
    industrial: '#C9A6A0', commercial: '#E7B3C0', retail: '#E7B3C0', farmyard: '#E3C79B', quarry: '#B7AE9D',
    grass: '#B4DE9A', park: '#B4DE9A', recreation_ground: '#B4DE9A', landfill: '#A5A06F', cemetery: '#94BFA0',
    construction: '#CFCFCF', garages: '#BDB5AE', religious: '#F2A07B', railway: '#A8A8A8', military: '#D9BDBD',
    water: '#9FD3F5', basin: '#9FD3F5', reservoir: '#9FD3F5' };
  var ROAD_S = { tertiary: ['#F7D358', 5], residential: ['#FFFFFF', 3.6], living_street: ['#FFFFFF', 3.6],
    unclassified: ['#FFFFFF', 3], service: ['#FFFFFF', 2.2], track: ['#A0784A', 1.8, '5 4'], path: ['#7A7A7A', 1.3, '3 3'],
    footway: ['#E58F8F', 1.4, '3 3'], steps: ['#E58F8F', 2.2, '1 3'], cycleway: ['#AA557F', 1.6, '4 3'],
    proposed: ['#B5B5B5', 2, '6 5'], construction: ['#F0B85A', 2.4, '6 5'] };
  var WATER_S = { river: ['#1C7ED6', 4], stream: ['#2B9BF4', 2.6], ditch: ['#5AB0F5', 1.5], drain: ['#5AB0F5', 1.5], dam: ['#6E6E73', 4], canal: ['#2B9BF4', 2] };
  var POWER_S = { line: ['#E31A1C', 3], minor_line: ['#F0605D', 2, '7 4'] };
  var BCAT = [
    { k: 'loc', ro: 'Locuințe', en: 'Dwellings', c: '#F2A65A', re: /locu|locat|locativ|bloc|vacan|livad|multifam|sedere/ },
    { k: 'pub', ro: 'Publice / comerciale', en: 'Public / commercial', c: '#E31A1C',
      re: /comerc|birou|oficiu|administr|adm|magazin|servic|cult|biseric|invat|sanat|^gara$|statie|punct de/ },
    { k: 'prod', ro: 'Producere / depozite', en: 'Production / storage', c: '#6A3D9A',
      re: /produc|industr|agric|agroind|depoz|depzit|atelier|cazanger|sera/ },
    { k: 'anx', ro: 'Anexe gospodărești', en: 'Outbuildings', c: '#B8B8B8',
      re: /sura|єura|surг|sara|sarai|garaj|gataj|beci|baci|bucat|bucг|buc|acces|aces|auxil|auzil|anex|magaz|subter|subsol|baie|sauna|wc|terasa|frigider|constr|const|costr|fundam|fundat|nefinal|viitor/ },
    { k: 'nsp', ro: 'Nespecificat', en: 'Unspecified', c: '#DDDDDD', re: null }
  ];
  function bcat(p) {
    var v = (p.dest || '').toLowerCase();
    for (var i = 0; i < BCAT.length - 1; i++) { if (BCAT[i].re.test(v)) return BCAT[i].k; }
    return 'nsp';
  }
  var POI_FAM = [
    { k: 'food', ro: 'Alimentație', en: 'Food and drink', c: '#F56300',
      tags: ['convenience', 'supermarket', 'butcher', 'bakery', 'alcohol', 'cafe', 'fast_food', 'restaurant', 'bar', 'coffee'] },
    { k: 'health', ro: 'Sănătate', en: 'Health', c: '#E31A1C', tags: ['pharmacy', 'chemist', 'clinic', 'dentist', 'doctors'] },
    { k: 'auto', ro: 'Auto', en: 'Car services', c: '#6E6E73',
      tags: ['car_repair', 'car_parts', 'tyres', 'car_wash', 'fuel', 'parking', 'parking_entrance', 'charging_station', 'motorcycle_repair'] },
    { k: 'public', ro: 'Servicii publice', en: 'Public services', c: '#0071E3',
      tags: ['police', 'post_office', 'post_box', 'library', 'events_venue', 'bureau_de_change', 'payment_terminal'] },
    { k: 'shops', ro: 'Magazine și servicii', en: 'Shops and services', c: '#8E44AD',
      tags: ['hardware', 'clothes', 'tailor', 'hairdresser', 'florist', 'paint', 'garden_centre', 'furniture', 'toys', 'variety_store', 'pet'] },
    { k: 'other', ro: 'Loisir și altele', en: 'Leisure and other', c: '#1A9E6F', tags: [] }
  ];
  function poiFam(p) {
    for (var i = 0; i < POI_FAM.length - 1; i++) { if (POI_FAM[i].tags.indexOf(p.tip) >= 0) return POI_FAM[i].k; }
    return 'other';
  }
  var ICONS = ('alcohol artwork attraction bakery bar bench bus_station bus_stop butcher cafe car_parts car_repair car_wash ' +
    'charging_station chemist clinic clothes coffee convenience events_venue fast_food fitness_centre fitness_station florist fuel ' +
    'garden_centre hairdresser hardware library memorial motorcycle_repair paint parking payment_terminal pharmacy picnic_site pitch ' +
    'platform playground police post_box post_office recycling restaurant station stop_position supermarket swimming_pool tailor tyres ' +
    'waste_disposal').split(' ');
  function pointLayer(color, size) {
    size = size || 22;
    return function (f, latlng) {
      var t = f.properties.tip;
      if (ICONS.indexOf(t) >= 0) {
        return L.marker(latlng, { icon: L.icon({ iconUrl: 'icons/' + t + '.svg', iconSize: [size, size], className: 'ico' }), pane: 'pts' });
      }
      return L.circleMarker(latlng, { radius: 6, color: '#fff', weight: 1.5, fillColor: color, fillOpacity: 1, pane: 'pts', renderer: R.pts });
    };
  }

  // ------------------------------------------------------------------ definitia temelor
  // fiecare strat: { file, g (grup legenda), cat(p) -> cheie, cats: [{k, label(), sw}], style(p), point, popup(p), hover }
  function fill(c, o, stroke, w) { return { color: stroke || '#4d4d4d', weight: w === undefined ? 0.6 : w, fillColor: c, fillOpacity: o === undefined ? 1 : o }; }
  var OUTLINE = {
    file: 'aoi', g: 'boundary', pane: 'outline', single: true, label: 'boundary',
    style: function () { return { color: '#FF2D2D', weight: 3, fill: false }; },
    sw: 'outline'
  };

  var DEF = {
    localizare: [
      { file: 'aoi', g: 'boundary', pane: 'polys', single: true, sw: 'outline',
        style: function () { return { color: '#FF2D2D', weight: 3.5, fillColor: '#FF2D2D', fillOpacity: 0.07 }; },
        popup: function (p) {
          return popup(u('boundary'), p.nume, [[u('pop'), num(p.populatie) + ' ' + u('inh')], [u('men'), num(p.barbati)],
            [u('women'), num(p.femei)], [u('area'), num(2770) + ' ha']]);
        } }
    ],
    terenuri: [
      { file: 'landuse', g: 'gLand', pane: 'polys', ctx: 'land', cat: function (p) { return p.tip; }, sizeBy: 'ha',
        color: function (k) { return LAND_C[k] || '#E8E8E8'; },
        style: function (p) { return fill(LAND_C[p.tip] || '#E8E8E8', 0.82, '#6e6e6e', 0.6); },
        popup: function (p) { return popup(u('gLand'), lbl('land', p.tip), [[u('name'), p.nume], [u('area'), area(p.ha)]]); } },
      { file: 'apa_pol', g: 'gWater', pane: 'polys', single: true, sw: 'fill', swc: '#9FD3F5',
        style: function () { return fill('#9FD3F5', 0.9, '#2B9BF4', 0.8); },
        popup: function (p) { return popup(u('gWater'), p.nume || lbl('water', p.tip), [[u('type'), lbl('water', p.tip)], [u('area'), area(p.ha)]]); } },
      OUTLINE
    ],
    cladiri: [
      { file: 'terenuri', g: 'gParcels', pane: 'polys', single: true, sw: 'fill', swc: 'rgba(139,90,43,.25)',
        style: function () { return fill('#8B5A2B', 0.13, '#6b4a2b', 0.5); },
        popup: function (p) {
          return popup(u('gParcels'), u('parcel'), [[u('cad'), p.cod], [u('house'), p.nr], [u('area'), area(p.ha)]]);
        } },
      { file: 'cladiri', g: 'gBuild', pane: 'polys', cat: bcat, fixedCats: BCAT,
        color: function (k) { for (var i = 0; i < BCAT.length; i++) if (BCAT[i].k === k) return BCAT[i].c; },
        catLabel: function (k) { for (var i = 0; i < BCAT.length; i++) if (BCAT[i].k === k) return BCAT[i][lang]; },
        style: function (p) { var k = bcat(p); var c; BCAT.forEach(function (b) { if (b.k === k) c = b.c; }); return fill(c, 1, '#4d4d4d', 0.5); },
        popup: function (p) {
          var k = bcat(p), name; BCAT.forEach(function (b) { if (b.k === k) name = b[lang]; });
          var nr = p.nr ? p.nr + (p.lit ? ' ' + p.lit : '') : null;
          return popup(u('building'), name, [[u('use'), fixText(p.dest)], [u('cad'), p.cod], [u('house'), nr]]);
        } },
      OUTLINE
    ],
    servicii: [
      { file: 'agrement_pol', g: 'gLeisureZones', pane: 'polys', single: true, sw: 'fill', swc: 'rgba(44,162,95,.45)',
        style: function () { return fill('#2CA25F', 0.35, '#1E7B45', 0.8); },
        popup: function (p) {
          return popup(u('gLeisure'), p.nume || lbl('leisure', p.tip), [[u('type'), lbl('leisure', p.tip)],
            [u('sport'), p.sport ? lbl('sport', p.sport) : null], [u('area'), area(p.ha)]]);
        } },
      { file: 'poi', g: 'poi', pane: 'pts', cat: poiFam, fixedCats: POI_FAM, point: 'fam', search: true,
        color: function (k) { for (var i = 0; i < POI_FAM.length; i++) if (POI_FAM[i].k === k) return POI_FAM[i].c; },
        catLabel: function (k) { for (var i = 0; i < POI_FAM.length; i++) if (POI_FAM[i].k === k) return POI_FAM[i][lang]; },
        popup: function (p) {
          var adr = p.strada ? p.strada + (p.nr ? ' ' + p.nr : '') : null;
          var tel = p.tel ? '<a href="tel:' + esc(p.tel.replace(/\s/g, '')) + '">' + esc(p.tel) + '</a>' : null;
          var web = p.web ? '<a href="' + esc(p.web) + '" target="_blank" rel="noopener">' + esc(p.web.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')) + '</a>' : null;
          return popup(lbl('poi', p.tip), p.nume || lbl('poi', p.tip), [[u('addr'), adr], [u('hours'), p.program],
            [u('phone'), tel, true], [u('web'), web, true]]);
        } },
      { file: 'transport', g: 'gTransport', pane: 'pts', single: true, sw: 'icon', swi: 'bus_stop', search: true,
        point: pointLayer('#7570B3', 20),
        popup: function (p) {
          return popup(u('gTransport'), p.nume || lbl('transport', p.tip), [[u('type'), lbl('transport', p.tip)],
            [u('shelter'), p.adapost === 'yes' ? u('yes') : p.adapost === 'no' ? u('no') : null]]);
        } },
      { file: 'agrement_pct', g: 'gLeisure', pane: 'pts', single: true, sw: 'icon', swi: 'playground', search: true,
        point: pointLayer('#2CA25F'),
        popup: function (p) {
          return popup(u('gLeisure'), p.nume || lbl('leisure', p.tip), [[u('type'), lbl('leisure', p.tip)],
            [u('sport'), p.sport ? lbl('sport', p.sport) : null]]);
        } },
      { file: 'istoric', g: 'gHeritage', pane: 'pts', single: true, sw: 'icon', swi: 'memorial', point: pointLayer('#984EA3', 26),
        popup: function (p) { return popup(u('gHeritage'), lbl('historic', p.subtip || p.tip), [[u('type'), lbl('historic', p.tip)]]); } },
      OUTLINE
    ],
    infrastructura: [
      { file: 'apa_pol', g: 'gWater', pane: 'polys', single: true, sw: 'fill', swc: '#9FD3F5', label: 'wpoly',
        style: function () { return fill('#9FD3F5', 0.9, '#2B9BF4', 0.8); },
        popup: function (p) { return popup(u('gWater'), p.nume || lbl('water', p.tip), [[u('type'), lbl('water', p.tip)], [u('area'), area(p.ha)]]); } },
      { file: 'drumuri', g: 'gRoads', pane: 'lines', ctx: 'road', cat: function (p) { return p.tip; }, sizeBy: 'm', casing: true,
        color: function (k) { return (ROAD_S[k] || ['#CCCCCC'])[0]; },
        style: function (p) { var s = ROAD_S[p.tip] || ['#CCCCCC', 1.5]; return { color: s[0], weight: s[1], dashArray: s[2] || null, lineCap: 'round' }; },
        popup: function (p) { return popup(u('gRoads'), p.nume || lbl('road', p.tip), [[u('type'), lbl('road', p.tip)], [u('len'), length(p.m)]]); } },
      { file: 'apa_lin', g: 'gWater', pane: 'lines', ctx: 'water', cat: function (p) { return p.tip; }, sizeBy: 'm',
        color: function (k) { return (WATER_S[k] || ['#2B9BF4'])[0]; },
        style: function (p) { var s = WATER_S[p.tip] || ['#2B9BF4', 1.5]; return { color: s[0], weight: s[1] }; },
        popup: function (p) { return popup(u('gWater'), p.nume || lbl('water', p.tip), [[u('type'), lbl('water', p.tip)], [u('len'), length(p.m)]]); } },
      { file: 'electric_lin', g: 'gPower', pane: 'lines', ctx: 'power', cat: function (p) { return p.tip; }, sizeBy: 'm',
        color: function (k) { return (POWER_S[k] || ['#E31A1C'])[0]; },
        style: function (p) { var s = POWER_S[p.tip] || ['#E31A1C', 2]; return { color: s[0], weight: s[1], dashArray: s[2] || null }; },
        popup: function (p) { return popup(u('gPower'), lbl('power', p.tip), [[u('name'), p.nume], [u('operator'), p.operator], [u('len'), length(p.m)]]); } },
      { file: 'electric_pol', g: 'gPower', pane: 'polys', single: true, sw: 'fill', swc: '#A65628', label: 'substations',
        style: function () { return fill('#A65628', 0.55, '#7F3B08', 1); },
        popup: function (p) { return popup(u('gPower'), p.nume || lbl('power', p.tip), [[u('type'), lbl('power', p.tip)], [u('operator'), p.operator]]); } },
      { file: 'posturi', g: 'gPower', pane: 'pts', single: true, sw: 'point', swc: '#A65628', label: 'substations', hideInLegend: true,
        point: function (f, latlng) { return L.circleMarker(latlng, { radius: 6, color: '#fff', weight: 1.5, fillColor: '#A65628', fillOpacity: 1, pane: 'pts', renderer: R.pts }); },
        popup: function (p) { return popup(u('gPower'), p.nume || lbl('power', p.tip), [[u('type'), lbl('power', p.tip)], [u('operator'), p.operator]]); } },
      OUTLINE
    ]
  };

  // ------------------------------------------------------------------ construire straturi + legenda
  var groups = {};          // g -> { layers: [L.LayerGroup], items: {k: {layers:[...], count, size}} , order }
  var searchables = [];     // straturi de puncte cautabile

  function addLayer(def, data) {
    var g = groups[def.g] || (groups[def.g] = { layers: [], items: {}, order: Object.keys(groups).length, defs: [] });
    g.defs.push(def);
    var holder = L.layerGroup().addTo(map);
    g.layers.push(holder);
    var byCat = {};
    data.features.forEach(function (f) {
      var k = def.cat ? def.cat(f.properties) : '_';
      (byCat[k] = byCat[k] || []).push(f);
    });
    Object.keys(byCat).forEach(function (k) {
      var feats = { type: 'FeatureCollection', features: byCat[k] };
      var sub = L.layerGroup();
      var opts = { pane: def.pane, renderer: R[def.pane] };
      // straturile de linii/poligoane nu trebuie sa deseneze puncte ramase de la decupare
      if (!def.point) opts.filter = function (f) { return f.geometry && !/Point/.test(f.geometry.type); };
      if (def.casing) {
        L.geoJSON(feats, { pane: 'casing', renderer: R.casing, interactive: false, style: function (f) {
          var s = ROAD_S[f.properties.tip]; if (!s || s[2]) return { opacity: 0, weight: 0 };
          return { color: '#7d7d7d', weight: s[1] + 2.2, lineCap: 'round' };
        } }).addTo(sub);
      }
      if (def.point) {
        opts.pointToLayer = def.point === 'fam' ? pointLayer(def.color(k)) : def.point;
      } else {
        opts.style = function (f) { return def.style(f.properties); };
      }
      if (def.pane === 'outline') opts.interactive = false;
      if (def.popup) {
        opts.onEachFeature = function (f, layer) {
          layer.bindPopup(function () { return def.popup(f.properties); }, { maxWidth: 300 });
          if (layer.setStyle && !def.point) {
            layer.on('mouseover', function () { layer.setStyle({ weight: (def.style(f.properties).weight || 1) + 2, color: '#0071e3' }); });
            layer.on('mouseout', function () { gj.resetStyle(layer); });
          }
        };
      }
      var gj = L.geoJSON(feats, opts).addTo(sub);
      sub.addTo(holder);
      if (def.search) searchables.push({ gj: gj });
      var it = g.items[def.single ? (def.label || def.g + ':' + def.file) : k];
      if (!it) {
        it = g.items[def.single ? (def.label || def.g + ':' + def.file) : k] = { layers: [], count: 0, size: 0, def: def, k: k };
      }
      it.layers.push({ sub: sub, holder: holder });
      it.count += byCat[k].length;
      if (def.sizeBy) byCat[k].forEach(function (f) { it.size += f.properties[def.sizeBy] || 0; });
    });
    return holder;
  }

  function swatch(def, k) {
    var c = def.color ? def.color(k) : def.swc;
    if (def.sw === 'outline') return '<span class="sw" style="border:3px solid #FF2D2D;background:transparent"></span>';
    if (def.sw === 'icon') return '<span class="sw ic" style="background-image:url(icons/' + def.swi + '.svg)"></span>';
    if (def.sw === 'point' || def.point === 'fam') return '<span class="sw pt" style="background:' + c + '"></span>';
    if (def.pane === 'lines') {
      var s = def.file === 'drumuri' ? ROAD_S[k] : null;
      var shadow = s && !s[2] ? 'box-shadow:0 0 0 1px #7d7d7d;' : '';
      return '<span class="sw ln" style="border-top-color:' + c + ';' + shadow + (s && s[2] ? 'border-top-style:dashed;' : '') + '"></span>';
    }
    return '<span class="sw" style="background:' + c + '"></span>';
  }

  function itemLabel(it) {
    var d = it.def;
    if (d.label) return u(d.label);
    if (d.single) return u(d.g === 'boundary' ? 'boundary' : d.g);
    if (d.catLabel) return d.catLabel(it.k);
    return lbl(d.ctx, it.k === 'undefined' || it.k === 'null' ? null : it.k);
  }
  function itemMeta(it) {
    if (it.def.sizeBy === 'ha') return num(it.size) + ' ha';
    if (it.def.sizeBy === 'm') return length(it.size);
    return num(it.count);
  }
  function groupTitle(key) {
    if (key === 'poi') return lang === 'ro' ? 'Puncte de interes' : 'Points of interest';
    return u(key);
  }

  function renderLegend() {
    var box = document.getElementById('legend');
    box.innerHTML = '';
    var any = false;
    Object.keys(groups).sort(function (a, b) { return groups[a].order - groups[b].order; }).forEach(function (key) {
      var g = groups[key];
      var items = Object.keys(g.items).map(function (k) { return g.items[k]; }).filter(function (it) { return !it.def.hideInLegend; });
      items.sort(function (a, b) {
        var fa = a.def.fixedCats, fb = b.def.fixedCats;
        if (fa && fb && a.def === b.def) {
          var ia = fa.map(function (x) { return x.k; }).indexOf(a.k), ib = fa.map(function (x) { return x.k; }).indexOf(b.k);
          return ia - ib;
        }
        if (a.def !== b.def) return 0;
        return (b.size || b.count) - (a.size || a.count);
      });
      var el = document.createElement('div');
      el.className = 'grp';
      var total = items.reduce(function (s, it) { return s + it.count; }, 0);
      var isSingle = items.length === 1 && items[0].def.single;
      var h = '<label class="grp-h"><input type="checkbox" checked> ' + (isSingle ? swatch(items[0].def) : '') +
        '<span>' + esc(groupTitle(key)) + '</span><span class="cnt">' + (key === 'boundary' ? '' : num(total)) + '</span></label>';
      el.innerHTML = h;
      var cb = el.querySelector('input');
      cb.checked = g.layers.every(function (l) { return map.hasLayer(l); });
      cb.addEventListener('change', function () {
        g.layers.forEach(function (l) { if (cb.checked) l.addTo(map); else map.removeLayer(l); });
      });
      if (!isSingle) {
        var list = document.createElement('div');
        list.className = 'items';
        items.forEach(function (it) {
          any = true;
          var row = document.createElement('div');
          row.className = 'it';
          row.setAttribute('role', 'button');
          row.setAttribute('tabindex', '0');
          row.innerHTML = swatch(it.def, it.k) + '<span>' + esc(itemLabel(it)) + '</span><span class="cnt">' + itemMeta(it) + '</span>';
          var on = it.layers.every(function (x) { return x.holder.hasLayer(x.sub); });
          row.classList.toggle('off', !on);
          function toggle() {
            var show = row.classList.contains('off');
            it.layers.forEach(function (x) { if (show) x.holder.addLayer(x.sub); else x.holder.removeLayer(x.sub); });
            row.classList.toggle('off', !show);
          }
          row.addEventListener('click', toggle);
          row.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
          list.appendChild(row);
        });
        el.appendChild(list);
      }
      box.appendChild(el);
    });
    if (any) {
      var hint = document.createElement('p');
      hint.className = 'hint';
      hint.textContent = u('hintCat');
      box.appendChild(hint);
    }
  }

  // ------------------------------------------------------------------ cautare (tema servicii)
  function renderFilters() {
    var box = document.getElementById('filters');
    box.innerHTML = '';
    if (!searchables.length) return;
    var inp = document.createElement('input');
    inp.type = 'search';
    inp.className = 'search';
    inp.placeholder = u('search');
    inp.setAttribute('aria-label', u('search'));
    box.appendChild(inp);
    inp.addEventListener('input', function () {
      var q = inp.value.trim().toLowerCase();
      var hits = [];
      searchables.forEach(function (s) {
        s.gj.eachLayer(function (l) {
          var p = l.feature.properties;
          var hay = [p.nume, p.tip, lbl('poi', p.tip), lbl('transport', p.tip), lbl('leisure', p.tip), p.strada].join(' ').toLowerCase();
          var ok = !q || hay.indexOf(q) >= 0;
          if (l.setOpacity) l.setOpacity(ok ? 1 : 0.15);
          else if (l.setStyle) l.setStyle({ opacity: ok ? 1 : 0.15, fillOpacity: ok ? 1 : 0.15 });
          if (ok && q) hits.push(l);
        });
      });
      if (q && hits.length && hits.length <= 30) {
        map.fitBounds(L.featureGroup(hits).getBounds().pad(0.3), { maxZoom: 17 });
        if (hits.length === 1) hits[0].openPopup();
      }
    });
  }

  // ------------------------------------------------------------------ texte panou
  function renderTexts() {
    var t = THEME_TXT[THEME][lang];
    document.documentElement.lang = lang;
    document.title = t[0] + ' — WebGIS Bubuieci';
    document.getElementById('title').textContent = t[0];
    document.getElementById('subtitle').textContent = t[1];
    document.getElementById('src').textContent = t[2];
    document.getElementById('loading-lbl').textContent = u('loading');
    var full = document.getElementById('full');
    full.textContent = u('full');
    full.href = '?t=' + THEME + '&lang=' + lang;
    var closed = document.getElementById('panel').classList.contains('closed');
    document.getElementById('collapse-lbl').textContent = closed ? u('show') : u('hide');
    var themes = document.getElementById('themes');
    themes.innerHTML = THEMES_ORDER.map(function (k) {
      return '<a href="?t=' + k + '&lang=' + lang + '"' + (k === THEME ? ' class="on"' : '') + '>' + esc(THEME_TXT[k][lang][0]) + '</a>';
    }).join('');
    var base = document.getElementById('base');
    base.innerHTML = [['map', 'bMap'], ['muted', 'bMuted'], ['orto', 'bOrto']].map(function (b) {
      return '<button type="button" data-b="' + b[0] + '"' + (b[0] === baseMode ? ' class="on"' : '') + '>' + u(b[1]) + '</button>';
    }).join('');
    base.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { setBase(b.getAttribute('data-b')); }); });
  }

  var panel = document.getElementById('panel');
  document.getElementById('collapse').addEventListener('click', function () {
    var closed = panel.classList.toggle('closed');
    this.setAttribute('aria-expanded', closed ? 'false' : 'true');
    document.getElementById('collapse-lbl').textContent = closed ? u('show') : u('hide');
  });
  if (window.innerWidth < 640 || (EMBED && window.innerHeight < 420)) panel.classList.add('closed');

  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ro';
    map.closePopup();
    renderTexts();
    renderLegend();
    renderFilters();
  }
  // portalul trimite limba catre hartile incorporate
  window.addEventListener('message', function (e) {
    if (e.origin === location.origin && e.data && e.data.type === 'lang') setLang(e.data.lang);
  });

  // ------------------------------------------------------------------ pornire
  setBase(baseMode);
  renderTexts();
  var defs = DEF[THEME];
  Promise.all(defs.map(function (d) { return load(d.file); })).then(function (all) {
    var bounds = null;
    defs.forEach(function (d, i) {
      var holder = addLayer(d, all[i]);
      if (d.file === 'aoi') bounds = L.geoJSON(all[i]).getBounds();
    });
    renderLegend();
    renderFilters();
    if (THEME === 'cladiri') {
      map.fitBounds([[46.9770, 28.9285], [46.9885, 28.9500]]);
    } else if (THEME === 'localizare') {
      map.fitBounds(bounds, { padding: [20, 20] });
      map.setZoom(map.getZoom() - 2);
    } else if (THEME === 'servicii') {
      map.fitBounds([[46.9780, 28.9295], [46.9900, 28.9485]]);   // centrul satului, unde sunt majoritatea serviciilor
    } else {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
    document.getElementById('loading').classList.add('done');
  }).catch(function (err) {
    document.getElementById('loading-lbl').textContent = 'Eroare: ' + err;
  });
})();
