/* Portal WebGIS Bubuieci — limba RO/EN, taburi harti, lightbox, meniu mobil, carusele, animatii */
(function () {
  'use strict';

  // ---------------- traduceri (RO = textul din HTML, EN = mai jos) ----------------
  var EN = {
    'nav.sub': '· PBL UTM', 'nav.story': 'Story', 'nav.charts': 'Charts', 'nav.gallery': 'Gallery',
    'nav.maps': 'Interactive maps', 'nav.data': 'Downloads', 'nav.labs': 'Projects', 'nav.contact': 'Contact',
    'hero.eyebrow': 'WebGIS portal · Chișinău Municipality',
    'hero.title': 'Bubuieci.<br>The full portrait.',
    'hero.lead': 'The village at the gates of Chișinău, explained through maps: land, buildings, services and infrastructure — from open and official data.',
    'hero.cta1': 'Read the story', 'hero.cta2': 'Open the map ›',
    'hero.alt': 'Bubuieci town hall, August 2025',
    'hero.cap': 'Bubuieci town hall, August 2025 · Photo: VictorCiobanu, CC0',
    'card1.t': 'The Bubuieci story', 'card1.d': 'Five chapters with thematic maps, photos, charts and a timeline of the village.',
    'card2.t': 'Interactive maps', 'card2.d': 'Explore the layers with zoom, search and information pop-ups.',
    'card3.t': 'Downloads', 'card3.d': 'The thematic maps as 200 dpi PNG files, ready to print.',
    'card4.t': 'Projects', 'card4.d': 'The seven PBL lab works, step by step.',
    'more': 'Learn more ›',
    'stats.h': 'Bubuieci in numbers. <span>At a glance.</span>',
    'stats.1': 'inhabitants', 'stats.2': 'village area', 'stats.3': 'buildings in the cadastre',
    'stats.4': 'points of interest', 'stats.5': 'of roads',
    'stats.src': 'Sources: population — NBS (attributes of the AOI layer, lab 2); area and lengths — GIS computation in QGIS; buildings — cadastre, sector 0142; points of interest and roads — OpenStreetMap, 2026.',
    'story.h': 'The Bubuieci story. <span>In five maps.</span>',
    'story.p': 'An introduction, five chapters and conclusions — a visual story built on open and official GIS data.',
    'p.goal.k': 'Goal', 'p.goal': 'To present Bubuieci through a GIS analysis of its land, buildings, services and networks, accessible to everyone.',
    'p.msg.k': 'Key message', 'p.msg': 'Bubuieci is agricultural by territory but suburban by way of life — and it grows year after year.',
    'p.aud.k': 'Target audience', 'p.aud': 'Residents, the town hall and local authorities, investors, and geodesy and GIS students.',
    'p.data.k': 'Data and tools', 'p.data': 'OpenStreetMap, the cadastre (sector 0142), CORINE Land Cover, NSDI · QGIS, qgis2web, Leaflet.',
    'zoom': 'Enlarge map ⤢',
    'c1.n': 'Chapter 1 · Location', 'c1.t': 'Why Bubuieci?', 'c1.n2': 'Location',
    'c1.p1': 'Bubuieci is a village within Chișinău Municipality, south-east of the city, on the left bank of the Bîc river. It is home to <strong>7,617 people</strong> (3,707 men and 3,910 women) on <strong>2,770 ha</strong> — about <strong>275 inhabitants/km²</strong>.',
    'c1.p2': 'A place between village and city: houses with gardens sit next to the capital’s wastewater plant, industrial areas and the airport.',
    'c2.n': 'Chapter 2 · Land use', 'c2.t': 'A village of fields', 'c2.n2': 'Land use',
    'c2.p1': 'Half of the territory is farmland: <strong>1,385 ha of arable land (50 %)</strong>, plus 176 ha of allotments and gardens, 108 ha of orchards and 15 ha of vineyards. Residential areas cover <strong>584 ha (21 %)</strong>, and the “Bubuieci” and “Humulești” forests <strong>233 ha (8 %)</strong>.',
    'c2.p2': 'To the west, along the Bîc, lie the industrial zone and the municipal wastewater treatment plant — the largest water surface in the village (12 ha of basins).',
    'c3.n': 'Chapter 3 · Built-up area', 'c3.t': 'House after house', 'c3.n2': 'Built-up area',
    'c3.p1': 'The cadastral register holds <strong>5,868 buildings</strong> and <strong>10,165 land parcels</strong>:',
    'c3.list': '<li><strong>3,837 dwellings (65 %)</strong> — detached houses, holiday homes, blocks of flats</li><li><strong>1,742 outbuildings (30 %)</strong> — barns, garages, cellars, summer kitchens</li><li><strong>125 public and commercial buildings</strong> — high school, kindergarten, town hall, shops</li><li><strong>103 production buildings and warehouses</strong></li>',
    'c3.p2': 'Buildings cover only <strong>1.7 %</strong> of the land and the typical parcel is <strong>730 m²</strong>. The village is growing: see the chart of cadastral records in the timeline.',
    'c3.call': 'OpenStreetMap maps only 851 buildings — 15 % of the real ones. Official data are indispensable.',
    'c4.n': 'Chapter 4 · Services and transport', 'c4.t': 'Everyday life', 'c4.n2': 'Services and transport',
    'c4.p1': 'The village centre, around Toader Bubuiog street, gathers most of the <strong>109 points of interest</strong>:',
    'c4.list': '<li><strong>20 grocery stores</strong>, 3 supermarkets, 6 butchers, 2 bakeries</li><li><strong>3 pharmacies</strong>, 3 drugstores and a dental office</li><li>8 car repair shops, 5 cafés, post office, police, library</li><li><strong>15 playgrounds</strong>, 9 sports pitches, 7 swimming pools</li>',
    'c4.p2': 'The link to the city: <strong>49 bus stops</strong> along the main roads. In the centre, a monument honours the villagers who fell in the Second World War.',
    'c5.n': 'Chapter 5 · Infrastructure', 'c5.t': 'The networks that keep the village alive', 'c5.n2': 'Infrastructure',
    'c5.list': '<li><strong>Roads: 258 km</strong> — 81 km of residential streets, 79 km of field tracks; 147 streets are named</li><li><strong>Water:</strong> the Bîc river (2.9 km), 10.5 km of streams, 12.7 km of canals and ditches</li><li><strong>Power: 28 km of power lines</strong>, 195 poles, 24 towers, 12 substations</li>',
    'ph.primaria': 'Bubuieci town hall, 2025 · Photo: VictorCiobanu, CC0',
    'ph.adormirea': 'Church of the Dormition, 2025 · Photo: VictorCiobanu, CC0',
    'ph.monument': 'Second World War memorial, 2025 · Photo: VictorCiobanu, CC0',
    'ph.treime': 'Holy Trinity church, 2025 · Photo: VictorCiobanu, CC0',
    'ph.strada': 'Toader Bubuiog street, April 2021 · Photo: Gikü, CC0',
    'ph.centru': 'The village shopping centre, 2011 · Photo: Alexander Murvanidze, CC BY-SA 3.0',
    'ph.camp': 'Farmland at the edge of the village, 2011 · Photo: Alexander Murvanidze, CC BY-SA 3.0',
    'ph.drum': 'Road and power line towards the fields, 2011 · Photo: Alexander Murvanidze, CC BY-SA 3.0',
    'g.h': 'The data behind the story. <span>Charts and diagrams.</span>',
    'g1.t': 'Land use', 'g1.sub': 'hectares · % of the village area',
    'g1.a': 'Arable land', 'g1.b': 'Residential', 'g1.c': 'Forests', 'g1.d': 'Allotments and gardens',
    'g1.e': 'Meadows', 'g1.f': 'Orchards and vineyards', 'g1.g': 'Industry and commerce',
    'g1.src': 'Source: OpenStreetMap (landuse), clipped to the AOI, computed in QGIS.',
    'g2.t': 'Buildings by use', 'g2.sub': '5,868 buildings in the cadastral register', 'g2.center': 'dwellings',
    'g2.a': 'Dwellings', 'g2.b': 'Outbuildings', 'g2.c': 'Public / commercial', 'g2.d': 'Production / storage', 'g2.e': 'Unspecified',
    'g2.src': 'Source: cadastre, sector 0142 (“functional use” field, grouped).',
    'g3.t': 'Open data vs official data', 'g3.sub': 'OpenStreetMap compared with the cadastre',
    'g3.a': 'Number of buildings', 'g3.b': 'Built-up area', 'g3.cad': 'Cadastre',
    'g3.src': 'OSM covers 15 % of buildings and 34 % of the built-up area. Sources: OSM 2026, cadastre.',
    'g4.t': 'Same land, another source', 'g4.sub': 'CORINE Land Cover · % of the village area',
    'g4.a': 'Arable land', 'g4.b': 'Discontinuous urban fabric', 'g4.c': 'Pastures', 'g4.d': 'Forests and shrubs',
    'g4.e': 'Complex cultivation', 'g4.f': 'Industrial / commercial', 'g4.g': 'Orchards',
    'g4.src': 'Source: Copernicus CORINE Land Cover, clipped to the AOI (official CLC colours).',
    't.h': 'Timeline. <span>From 1518 to today.</span>',
    't.1518': 'The year the village of Bubuieci was founded.',
    't.1941': 'The villagers who fell in the Second World War, honoured today by the memorial in the centre.',
    't.2008': 'The first changes recorded in the cadastral dataset of sector 0142.',
    't.2011': 'The first free photographs of the village (Panoramio, now on Wikimedia Commons).',
    't.2018': 'A jump in cadastral records: from 24 to 83 per year.',
    't.2025': 'A record: 159 buildings with changes recorded in a single year.',
    't.2026': 'This project: OSM data, cadastre, thematic maps and this portal.',
    'g5.t': 'The pace of construction', 'g5.sub': 'Buildings by year of their latest change in the cadastral register',
    'g5.src': 'Source: cadastre, sector 0142 — 946 buildings have a change date (2008–2025). Year 1518: Wikipedia.',
    'concl.h': 'Conclusions. <span>What the maps tell us.</span>',
    'concl.1': '<strong>Half of the land is arable</strong>, while the inhabited area covers one fifth of the territory.',
    'concl.2': '<strong>Two thirds of the buildings are dwellings</strong>, and new construction is accelerating year by year.',
    'concl.3': '<strong>Services are concentrated in the centre</strong>, while the outskirts rely on public transport.',
    'concl.4': '<strong>Open data alone are not enough:</strong> OSM covers only 15 % of buildings — combining it with the cadastre is essential.',
    'gal.h': 'Bubuieci in pictures. <span>Free photographs.</span>',
    'gal.src': 'All photographs come from Wikimedia Commons under free licences (CC0 and CC BY-SA 3.0). Click a photo to enlarge it.',
    'maps.h': 'Interactive maps. <span>Explore on your own.</span>',
    'maps.p': 'Two publications of the same QGIS project: a Leaflet map generated with qgis2web and a map hosted on QGIS Cloud (with WMS/WFS services).',
    'maps.leaflet': 'Click a feature for details · layer list on the right · ruler and search on the left.',
    'maps.cloud': 'Public WMS/WFS service: wms.qgiscloud.com/Eduard_Iftodii/bubuieci_webgis/',
    'maps.full': 'Full screen ↗',
    'dl.h': 'Downloads. <span>The thematic maps.</span>',
    'dl.p': 'A4 format, 200 dpi, with every map element: title, legend, scale, north arrow, sources and projection (MOLDREF99 / TM Moldova).',
    'dl.btn': 'Download ↓', 'dl.png': 'Download PNG ↓',
    'labs.h': 'Projects. <span>Seven PBL labs.</span>',
    'st.done': 'Completed', 'st.now': 'In progress', 'st.next': 'Upcoming',
    'l1.t': 'OpenStreetMap analysis', 'l1.d': 'Studying the OSM data for the village and a real edit published in the iD editor.',
    'l2.t': 'Defining the study area', 'l2.d': 'The AOI boundary of the village and exploring the national SDI WMS services (geodata.gov.md orthophoto).',
    'l3.t': 'Downloading and preparing data', 'l3.d': 'Nine OSM datasets via Overpass, cadastral data in MOLDREF99, clipping to the AOI and automatic styling with PyQGIS scripts.',
    'l4.t': 'Publishing on the web', 'l4.d': 'The map published on QGIS Cloud (WMS/WFS) and exported with qgis2web to Leaflet, hosted on GitHub Pages.',
    'l5.t': 'WebGIS storytelling', 'l5.d': 'Five thematic maps, charts, a timeline, a photo gallery and this portal.',
    'l6.t': 'GitHub, VS Code and Live Server', 'l6.d': 'Development tools for the WebGIS infrastructure and publishing data on the portal.',
    'l7.t': 'GeoServer: WMS and WFS', 'l7.d': 'Publishing the AOI data as standard OGC services.',
    'links.h': 'Useful links. <span>Sources and tools.</span>',
    'lk.inds': 'National Spatial Data Infrastructure of the Republic of Moldova.',
    'lk.geodata': 'National WMS services, including the orthophotos used in the project.',
    'lk.agcc': 'Agency for Geodesy, Cartography and Cadastre.',
    'lk.osm': 'The free map of the world — the source of the open data.',
    'lk.qgis': 'The open-source GIS used to build the project.',
    'lk.commons': 'The source of the free photographs of the village used on this site.',
    'ct.h': 'Your opinion matters.',
    'ct.p': 'Have a question, a remark, or found an error on the map? Write to us.',
    'ct.btn': 'Send an email ✉',
    'ft.author': 'Author: <strong>Iftodii Eduard</strong>, group IGC-223 F/R · Supervisor: Assoc. Prof. Dr. <strong>Sîrbu Rodica</strong>',
    'ft.uni': 'Technical University of Moldova · Faculty of Construction, Geodesy and Cadastre · 2026',
    'ft.src': 'Data: © OpenStreetMap contributors · cadastre, sector 0142 · Copernicus CORINE Land Cover · NSDI / geodata.gov.md · Photos: Wikimedia Commons (VictorCiobanu, Gikü — CC0; Alexander Murvanidze — CC BY-SA 3.0)',
    'ft.tech': 'Built with QGIS, qgis2web, Leaflet and GitHub Pages'
  };

  var nodes = document.querySelectorAll('[data-i18n]');
  var RO = {};
  nodes.forEach(function (el) { RO[el.getAttribute('data-i18n')] = el.innerHTML; });
  var altNodes = document.querySelectorAll('[data-i18n-alt]');
  altNodes.forEach(function (el) { RO[el.getAttribute('data-i18n-alt')] = el.getAttribute('alt'); });

  var lang = 'ro';
  function t(key) { return (lang === 'en' ? EN[key] : RO[key]) || RO[key] || ''; }

  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ro';
    document.documentElement.lang = lang;
    nodes.forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (lang === 'ro' || EN[k] !== undefined) el.innerHTML = t(k);
    });
    altNodes.forEach(function (el) { el.setAttribute('alt', t(el.getAttribute('data-i18n-alt'))); });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-lang') === lang);
    });
    document.title = lang === 'en' ? 'WebGIS Bubuieci — a full portrait of the village'
                                   : 'WebGIS Bubuieci — portret complet al satului';
    try { localStorage.setItem('lang', lang); } catch (e) { /* stocare indisponibila */ }
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { /* ignora */ }
  if (saved === 'en') setLang('en');

  // ---------------- meniu mobil ----------------
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
  });

  // ---------------- taburi harti (QGIS Cloud se incarca doar la cerere) ----------------
  document.querySelectorAll('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-tab');
      document.querySelectorAll('.tabs button').forEach(function (x) { x.classList.toggle('on', x === b); });
      document.querySelectorAll('.pane').forEach(function (p) { p.classList.toggle('on', p.id === 'pane-' + id); });
      var fr = document.querySelector('#pane-' + id + ' iframe[data-src]');
      if (fr && !fr.getAttribute('src')) fr.setAttribute('src', fr.getAttribute('data-src'));
    });
  });

  // ---------------- lightbox (harti + fotografii) ----------------
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbCap = document.getElementById('lb-cap');
  var lbDl = document.getElementById('lb-dl');
  function closeLb() { lb.classList.remove('on'); lbImg.removeAttribute('src'); document.body.style.overflow = ''; }
  document.querySelectorAll('.ch-img, .ch-photo, .ph').forEach(function (fig) {
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    function open() {
      lbImg.src = fig.getAttribute('data-full');
      lbImg.alt = fig.querySelector('img').alt;
      lbCap.innerHTML = t(fig.getAttribute('data-cap'));
      var png = fig.getAttribute('data-png');
      lbDl.style.display = png ? '' : 'none';
      if (png) lbDl.href = png;
      lb.classList.add('on');
      document.body.style.overflow = 'hidden';
    }
    fig.addEventListener('click', open);
    fig.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('x')) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('on')) closeLb(); });

  // ---------------- carusele (proiecte, galerie) ----------------
  document.querySelectorAll('[data-scroll]').forEach(function (b) {
    b.addEventListener('click', function () {
      var sc = document.getElementById(b.getAttribute('data-target') || 'scroller');
      sc.scrollBy({ left: Number(b.getAttribute('data-scroll')) * sc.clientWidth * 0.8, behavior: 'smooth' });
    });
  });

  // ---------------- aparitie la derulare ----------------
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();
