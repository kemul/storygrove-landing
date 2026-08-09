// Curated flagship lake: real shoreline of Danau Kenanga (Danau UI), from OpenStreetMap (way 28994172).
const KENANGA_OUTLINE = [[-6.3659122,106.8294416],[-6.3660367,106.8293086],[-6.3661434,106.8292093],[-6.3662727,106.829133],[-6.3663995,106.8290825],[-6.3665992,106.8290544],[-6.3669555,106.8290323],[-6.367071,106.8292576],[-6.367223,106.8295231],[-6.3673589,106.8298075],[-6.3674975,106.8300532],[-6.3675688,106.8301548],[-6.3677461,106.8302856],[-6.3679494,106.8304807],[-6.3679387,106.8305665],[-6.3679134,106.8306631],[-6.3678894,106.8307811],[-6.3678467,106.8308642],[-6.3677348,106.8309554],[-6.3674121,106.8311017],[-6.3666896,106.8314244],[-6.3664126,106.8315281],[-6.3662857,106.8312418],[-6.3660501,106.830738],[-6.3660164,106.8306707],[-6.3658146,106.8306383],[-6.3657584,106.8303775],[-6.3658494,106.8304338],[-6.3659798,106.8304408],[-6.3659744,106.8303464],[-6.3658541,106.830283],[-6.3658306,106.8302703],[-6.365804,106.8302824],[-6.3657482,106.8302195],[-6.3657308,106.8299369],[-6.3657625,106.829684],[-6.3657679,106.8296659],[-6.3658088,106.8295933],[-6.3659122,106.8294416]];
const KENANGA_CENTER = [-6.36658, 106.83015];

const ICONS = {
  akhlak: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 21s-7-4.35-9.5-8.5C1 9 2.5 5 6.5 5c2 0 3.5 1.2 4.5 2.7C12 6.2 13.5 5 15.5 5 19.5 5 21 9 21 12.5 18.5 16.65 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  logika: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 3h6M10 3v5.5L4.8 17a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 8.5V3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  leadership: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 21V4m0 1h13l-3 4 3 4H5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  bisnis: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 21v-8m0 0c0-3 2-5 5-5 0 3-2 5-5 5Zm0 0c0-3-2-5-5-5 0 3 2 5 5 5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>',
};

const PILLAR_META = [
  { key: 'akhlak', pillar: 'Pilar Akhlak', color: '#C08A3E', icon: ICONS.akhlak },
  { key: 'logika', pillar: 'Pilar Logika Ilmiah', color: '#5FCFA0', icon: ICONS.logika },
  { key: 'leadership', pillar: 'Pilar Leadership', color: '#C2704A', icon: ICONS.leadership },
  { key: 'bisnis', pillar: 'Pilar Bisnis', color: '#3E8FA0', icon: ICONS.bisnis },
];

// Danau Kenanga gets hand-written, place-specific content.
function kenangaPillars() {
  return [
    {
      ...PILLAR_META[0],
      title: 'Menjaga apa yang alam titipkan',
      body: 'Danau ini sudah ada jauh sebelum kita lahir, dan akan terus dipakai oleh yang datang setelah kita. Menjaganya adalah bentuk tanggung jawab sederhana yang dimulai dari diri sendiri, bukan karena disuruh.',
      observation: 'Amati sekelilingmu — apakah ada sampah di tepi danau? Jika ada, pungut satu dan buang pada tempatnya.',
    },
    {
      ...PILLAR_META[1],
      title: 'Bagaimana air mengalir?',
      body: 'Air hujan di sekitar kampus meresap ke tanah, mengalir lewat akar-akar pohon, lalu berkumpul di danau ini. Mengamati dari mana air datang dan ke mana ia pergi adalah cara ilmuwan mulai memahami sebab dan akibat.',
      observation: 'Jatuhkan satu daun kering di permukaan air dan amati ke arah mana ia bergerak. Ke mana menurutmu air ini akhirnya mengalir?',
    },
    {
      ...PILLAR_META[2],
      title: 'Apa yang bisa kamu lakukan untuk danau ini?',
      body: 'Satu orang yang mulai memungut sampah di tepi danau bisa mengajak teman-temannya melakukan hal yang sama. Memimpin tidak selalu berarti jadi yang paling depan — kadang cukup jadi yang pertama bertindak.',
      observation: 'Ajak satu orang di dekatmu untuk sama-sama memperhatikan titik ini selama satu menit, lalu ceritakan apa yang kalian berdua lihat.',
    },
    {
      ...PILLAR_META[3],
      title: 'Bagaimana danau ini bisa menghidupi sekitarnya?',
      body: 'Air bersih, udara sejuk, dan pemandangan di sekitar danau adalah sumber daya yang bisa dimanfaatkan tanpa merusaknya — misalnya lewat wisata edukasi. Bisnis yang baik menjaga sumber dayanya agar tetap bisa dipakai di masa depan.',
      observation: 'Perhatikan sekelilingmu — apa satu hal di tempat ini yang bisa bermanfaat bagi orang lain tanpa perlu merusaknya?',
    },
  ];
}

// Any other lake: same 4-pillar structure, generic wording that still holds up anywhere.
function genericPillars(lakeName) {
  return [
    {
      ...PILLAR_META[0],
      title: 'Menjaga apa yang alam titipkan',
      body: `${lakeName} sudah ada jauh sebelum kita, dan akan terus dipakai oleh yang datang setelah kita. Menjaganya adalah tanggung jawab sederhana yang dimulai dari diri sendiri, bukan karena disuruh.`,
      observation: 'Amati sekelilingmu — apakah ada sampah di tepi air? Jika ada, pungut satu dan buang pada tempatnya.',
    },
    {
      ...PILLAR_META[1],
      title: 'Bagaimana air di sini mengalir?',
      body: 'Air hujan di sekitar sini meresap ke tanah, mengalir lewat akar-akar pohon, lalu berkumpul di tempat ini. Mengamati dari mana air datang dan ke mana ia pergi adalah cara ilmuwan mulai memahami sebab dan akibat.',
      observation: 'Jatuhkan satu daun kering di permukaan air dan amati ke arah mana ia bergerak. Ke mana menurutmu air ini akhirnya mengalir?',
    },
    {
      ...PILLAR_META[2],
      title: 'Apa yang bisa kamu lakukan untuk tempat ini?',
      body: 'Satu orang yang mulai memungut sampah di tepi air bisa mengajak teman-temannya melakukan hal yang sama. Memimpin tidak selalu berarti jadi yang paling depan — kadang cukup jadi yang pertama bertindak.',
      observation: 'Ajak satu orang di dekatmu untuk sama-sama memperhatikan titik ini selama satu menit, lalu ceritakan apa yang kalian berdua lihat.',
    },
    {
      ...PILLAR_META[3],
      title: `Bagaimana ${lakeName} bisa menghidupi sekitarnya?`,
      body: 'Air bersih, udara sejuk, dan pemandangan di sekitarnya adalah sumber daya yang bisa dimanfaatkan tanpa merusaknya. Bisnis yang baik menjaga sumber dayanya agar tetap bisa dipakai di masa depan.',
      observation: 'Perhatikan sekelilingmu — apa satu hal di tempat ini yang bisa bermanfaat bagi orang lain tanpa perlu merusaknya?',
    },
  ];
}

function pointAt(outline, fraction) {
  const idx = Math.floor(fraction * (outline.length - 1));
  return outline[Math.max(0, Math.min(outline.length - 1, idx))];
}

function buildHotspots(lake) {
  const pillars = lake.isKenanga ? kenangaPillars() : genericPillars(lake.name);
  const fractions = [0, 0.28, 0.55, 0.82];
  return pillars.map((p, i) => ({
    ...p,
    coord: pointAt(lake.outline, fractions[i]),
    visited: false,
  }));
}

const NEAR_THRESHOLD_M = 700;   // "considered near enough to track live" radius
const CHECKPOINT_RADIUS_M = 30; // how close to a pillar point counts as "arrived"
const MIN_LAKE_AREA_M2 = 1500;  // filters out tiny retention ponds that aren't real destinations

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Rough planar shoelace area, accurate enough for filtering out tiny ponds.
function polygonAreaM2(outline) {
  if (outline.length < 3) return 0;
  const avgLat = outline.reduce((s, c) => s + c[0], 0) / outline.length;
  const mPerDegLat = 111320;
  const mPerDegLon = 111320 * Math.cos((avgLat * Math.PI) / 180);
  let area = 0;
  for (let i = 0; i < outline.length - 1; i++) {
    const [lat1, lon1] = outline[i];
    const [lat2, lon2] = outline[i + 1];
    const x1 = lon1 * mPerDegLon, y1 = lat1 * mPerDegLat;
    const x2 = lon2 * mPerDegLon, y2 = lat2 * mPerDegLat;
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2);
}

async function fetchNearbyLakes(lat, lon, radiusM, limit) {
  const query = `[out:json][timeout:20];(way["natural"="water"](around:${radiusM},${lat},${lon});relation["natural"="water"](around:${radiusM},${lat},${lon}););out geom;`;
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });
  if (!res.ok) throw new Error('overpass request failed');
  const data = await res.json();

  const all = data.elements
    .filter((el) => el.geometry && el.geometry.length > 3)
    .map((el) => {
      const outline = el.geometry.map((p) => [p.lat, p.lon]);
      const centerLat = outline.reduce((s, c) => s + c[0], 0) / outline.length;
      const centerLon = outline.reduce((s, c) => s + c[1], 0) / outline.length;
      const name = el.tags && el.tags.name;
      return {
        id: el.id,
        name: name || null,
        outline,
        center: [centerLat, centerLon],
        distance: haversineMeters(lat, lon, centerLat, centerLon),
        area: polygonAreaM2(outline),
        isKenanga: el.id === 28994172,
      };
    })
    .filter((l) => l.area >= MIN_LAKE_AREA_M2);

  // Prefer named lakes; only pad with unnamed ones if we don't have enough.
  const named = all.filter((l) => l.name).sort((a, b) => a.distance - b.distance);
  const unnamed = all.filter((l) => !l.name).sort((a, b) => a.distance - b.distance);
  return named
    .concat(unnamed)
    .slice(0, limit)
    .map((l) => ({ ...l, name: l.name || 'Situ tanpa nama' }));
}

const DANAU_KENANGA = {
  id: 28994172,
  name: 'Danau Kenanga',
  outline: KENANGA_OUTLINE,
  center: KENANGA_CENTER,
  distance: null,
  isKenanga: true,
};

// ===== Map setup =====
const map = L.map('map', {
  zoomControl: false,
  attributionControl: true,
  minZoom: 11,
  maxZoom: 19,
}).setView([-6.376, 106.826], 13);

L.control.zoom({ position: 'topright' }).addTo(map);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics | Data StoryGrove / OpenStreetMap',
  maxZoom: 19,
}).addTo(map);

let lakePolygon = null;
let markers = [];
let currentHotspots = [];
let userMarker = null;
let watchId = null;
let currentLake = null;
let nearbyLakesCache = [];
let lastCoord = null;
let otherLakeMarkers = [];

const userIcon = L.divIcon({
  className: '',
  html: '<div class="you-here"><span class="you-here-dot"></span></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function hotspotHtml(spot) {
  return `<div class="hotspot" style="--accent:${spot.color}"><span class="hotspot-dot"></span></div>`;
}

// ===== Popup =====
const overlay = document.getElementById('overlay');
const popupCard = document.getElementById('popupCard');
const popupIcon = document.getElementById('popupIcon');
const popupKicker = document.getElementById('popupKicker');
const popupTitle = document.getElementById('popupTitle');
const popupBody = document.getElementById('popupBody');
const popupClose = document.getElementById('popupClose');
const progress = document.getElementById('progress');
const legend = document.getElementById('legend');
const legendTitle = document.getElementById('legendTitle');
const legendSub = document.getElementById('legendSub');
const toast = document.getElementById('toast');

function renderBody(spot) {
  popupBody.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = spot.body;
  const obs = document.createElement('div');
  obs.className = 'observation';
  obs.innerHTML = `<span class="observation-label">Tugas Observasi</span><p>${spot.observation}</p>`;
  popupBody.appendChild(p);
  popupBody.appendChild(obs);
}

function openPopup(spot) {
  popupIcon.innerHTML = spot.icon;
  popupIcon.style.color = spot.color;
  popupKicker.textContent = spot.pillar;
  popupKicker.style.color = spot.color;
  popupTitle.textContent = spot.title;
  renderBody(spot);
  overlay.classList.add('open');
  popupCard.classList.add('open');
}
function closePopup() {
  overlay.classList.remove('open');
  popupCard.classList.remove('open');
}
overlay.addEventListener('click', closePopup);
popupClose.addEventListener('click', closePopup);

function updateProgress() {
  const count = currentHotspots.filter((s) => s.visited).length;
  progress.textContent = `${count}/4 titik dikunjungi`;
}

function showToast(spot) {
  toast.innerHTML = `<span class="toast-dot" style="background:${spot.color}"></span> Kamu tiba di <strong>${spot.pillar}</strong>`;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3200);
}

function markVisited(spot, index) {
  if (spot.visited) return;
  spot.visited = true;
  const el = markers[index].getElement();
  if (el) el.querySelector('.hotspot').classList.add('visited');
  updateProgress();
  showToast(spot);
  openPopup(spot);
}

function checkCheckpoints(lat, lon) {
  currentHotspots.forEach((spot, i) => {
    if (spot.visited) return;
    if (haversineMeters(lat, lon, spot.coord[0], spot.coord[1]) <= CHECKPOINT_RADIUS_M) {
      markVisited(spot, i);
    }
  });
}

function placeUserMarker(lat, lon) {
  if (!userMarker) {
    userMarker = L.marker([lat, lon], { icon: userIcon, zIndexOffset: 900 }).addTo(map);
  } else {
    userMarker.setLatLng([lat, lon]);
  }
}

function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

function startRealTracking() {
  legendSub.textContent = 'Lokasimu aktif — dekati tiap titik untuk observasi';
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      placeUserMarker(latitude, longitude);
      checkCheckpoints(latitude, longitude);
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
  );
}

function startSimulatedTracking(lake) {
  placeUserMarker(lake.center[0], lake.center[1]);
  legendSub.textContent = 'Mode simulasi — dekati danau untuk tracking langsung';
}

// ===== Other-lake indicators (visible when zoomed out from the active lake) =====
// Same marching-ants green outline as the active lake, just dimmer — real
// shape, not a generic pin, so it reads as "another lake" at a glance.
function renderOtherLakeMarkers(activeLake, coord) {
  otherLakeMarkers.forEach((m) => map.removeLayer(m));
  otherLakeMarkers = [];
  nearbyLakesCache
    .filter((l) => l.id !== activeLake.id)
    .forEach((lake) => {
      const outline = L.polygon(lake.outline, {
        color: '#5FCFA0',
        weight: 2,
        opacity: 0.55,
        fillColor: '#5FCFA0',
        fillOpacity: 0.06,
        dashArray: '8 7',
        className: 'lake-outline other-lake-outline',
      }).addTo(map);
      const distText = lake.distance != null ? ` · ${Math.round(lake.distance)} m` : '';
      outline.bindTooltip(`${lake.name}${distText}`, {
        sticky: true,
        direction: 'top',
        className: 'other-lake-tooltip',
      });
      outline.on('click', () => loadLake(lake, coord));
      outline.on('mouseover', () => outline.setStyle({ opacity: 0.95, weight: 3, fillOpacity: 0.16 }));
      outline.on('mouseout', () => outline.setStyle({ opacity: 0.55, weight: 2, fillOpacity: 0.06 }));
      otherLakeMarkers.push(outline);
    });
}

// ===== Loading a lake onto the map =====
function loadLake(lake, userCoord) {
  closePopup();
  stopTracking();
  if (lakePolygon) map.removeLayer(lakePolygon);
  markers.forEach((m) => map.removeLayer(m));
  if (userMarker) { map.removeLayer(userMarker); userMarker = null; }

  currentLake = lake;
  lastCoord = userCoord || lastCoord;
  currentHotspots = buildHotspots(lake);

  lakePolygon = L.polygon(lake.outline, {
    color: '#5FCFA0',
    weight: 3,
    opacity: 0.9,
    fillColor: '#5FCFA0',
    fillOpacity: 0.12,
    dashArray: '10 8',
    className: 'lake-outline',
  }).addTo(map);

  markers = currentHotspots.map((spot) => {
    const icon = L.divIcon({ className: '', html: hotspotHtml(spot), iconSize: [22, 22], iconAnchor: [11, 11] });
    const marker = L.marker(spot.coord, { icon, zIndexOffset: 800 }).addTo(map);
    marker.on('click', () => openPopup(spot));
    return marker;
  });

  renderOtherLakeMarkers(lake, lastCoord);

  legendTitle.textContent = lake.name;
  legend.hidden = false;
  updateProgress();

  document.getElementById('menuScreen').classList.add('hidden');

  setTimeout(() => {
    map.flyTo(lake.center, 17.3, { duration: 2.4, easeLinearity: 0.25 });
  }, 150);

  setTimeout(() => {
    const dist = userCoord ? haversineMeters(userCoord[0], userCoord[1], lake.center[0], lake.center[1]) : Infinity;
    if (userCoord && dist <= NEAR_THRESHOLD_M) {
      placeUserMarker(userCoord[0], userCoord[1]);
      checkCheckpoints(userCoord[0], userCoord[1]);
      startRealTracking();
    } else {
      startSimulatedTracking(lake);
    }
  }, 2600);
}

// ===== Menu =====
const menuScreen = document.getElementById('menuScreen');
const menuStatus = document.getElementById('menuStatus');
const menuList = document.getElementById('menuList');
const btnNearest = document.getElementById('btnNearest');
const btnChangeLake = document.getElementById('btnChangeLake');

function getLocation() {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

function directionsUrl(lake) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lake.center[0]},${lake.center[1]}`;
}

function renderLakeList(lakes, coord) {
  menuList.innerHTML = '';
  lakes.forEach((lake) => {
    const item = document.createElement('div');
    item.className = 'menu-list-item';
    const distText = lake.distance != null ? `${Math.round(lake.distance)} m` : '';

    const main = document.createElement('button');
    main.className = 'menu-list-main';
    main.innerHTML = `<strong>${lake.name}</strong>${distText ? `<small>${distText}</small>` : ''}`;
    main.addEventListener('click', () => loadLake(lake, coord));

    const direction = document.createElement('a');
    direction.className = 'menu-list-direction';
    direction.href = directionsUrl(lake);
    direction.target = '_blank';
    direction.rel = 'noopener';
    direction.title = 'Buka rute di Google Maps';
    direction.setAttribute('aria-label', `Buka rute ke ${lake.name} di Google Maps`);
    direction.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 11l17-8-8 17-2-7-7-2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    direction.addEventListener('click', (e) => e.stopPropagation());

    item.appendChild(main);
    item.appendChild(direction);
    menuList.appendChild(item);
  });
  menuList.hidden = false;
}

async function searchNearbyAndRenderList() {
  menuStatus.textContent = 'Mencari lokasimu...';
  menuList.hidden = true;
  const coord = await getLocation();
  if (!coord) {
    menuStatus.textContent = 'Aktifkan lokasi untuk menemukan danau di sekitarmu.';
    nearbyLakesCache = [DANAU_KENANGA];
    renderLakeList(nearbyLakesCache, null);
    return null;
  }
  lastCoord = coord;
  menuStatus.textContent = 'Mencari danau di sekitarmu...';
  try {
    const lakes = await fetchNearbyLakes(coord[0], coord[1], 6000, 5);
    nearbyLakesCache = lakes.length ? lakes : [DANAU_KENANGA];
    menuStatus.textContent = lakes.length ? '' : 'Tidak ditemukan danau bernama di sekitarmu — menampilkan Danau Kenanga.';
    renderLakeList(nearbyLakesCache, coord);
    return coord;
  } catch (e) {
    menuStatus.textContent = 'Pencarian gagal — menampilkan Danau Kenanga.';
    nearbyLakesCache = [DANAU_KENANGA];
    renderLakeList(nearbyLakesCache, coord);
    return coord;
  }
}

btnNearest.addEventListener('click', async () => {
  if (nearbyLakesCache.length && lastCoord) {
    loadLake(nearbyLakesCache[0], lastCoord);
    return;
  }
  const coord = await searchNearbyAndRenderList();
  loadLake(nearbyLakesCache[0] || DANAU_KENANGA, coord);
});

btnChangeLake.addEventListener('click', () => {
  stopTracking();
  legend.hidden = true;
  menuScreen.classList.remove('hidden');
  searchNearbyAndRenderList();
});

// Show the 5 nearest lakes as soon as the page opens.
searchNearbyAndRenderList();
