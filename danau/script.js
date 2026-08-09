// Real shoreline of Danau Kenanga (Danau UI), sourced from OpenStreetMap (way 28994172).
const LAKE_OUTLINE = [[-6.3659122,106.8294416],[-6.3660367,106.8293086],[-6.3661434,106.8292093],[-6.3662727,106.829133],[-6.3663995,106.8290825],[-6.3665992,106.8290544],[-6.3669555,106.8290323],[-6.367071,106.8292576],[-6.367223,106.8295231],[-6.3673589,106.8298075],[-6.3674975,106.8300532],[-6.3675688,106.8301548],[-6.3677461,106.8302856],[-6.3679494,106.8304807],[-6.3679387,106.8305665],[-6.3679134,106.8306631],[-6.3678894,106.8307811],[-6.3678467,106.8308642],[-6.3677348,106.8309554],[-6.3674121,106.8311017],[-6.3666896,106.8314244],[-6.3664126,106.8315281],[-6.3662857,106.8312418],[-6.3660501,106.830738],[-6.3660164,106.8306707],[-6.3658146,106.8306383],[-6.3657584,106.8303775],[-6.3658494,106.8304338],[-6.3659798,106.8304408],[-6.3659744,106.8303464],[-6.3658541,106.830283],[-6.3658306,106.8302703],[-6.365804,106.8302824],[-6.3657482,106.8302195],[-6.3657308,106.8299369],[-6.3657625,106.829684],[-6.3657679,106.8296659],[-6.3658088,106.8295933],[-6.3659122,106.8294416]];

const CENTER = [-6.36658, 106.83015];

const ICONS = {
  akhlak: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 21s-7-4.35-9.5-8.5C1 9 2.5 5 6.5 5c2 0 3.5 1.2 4.5 2.7C12 6.2 13.5 5 15.5 5 19.5 5 21 9 21 12.5 18.5 16.65 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  logika: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 3h6M10 3v5.5L4.8 17a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 8.5V3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  leadership: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 21V4m0 1h13l-3 4 3 4H5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  bisnis: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 21v-8m0 0c0-3 2-5 5-5 0 3-2 5-5 5Zm0 0c0-3-2-5-5-5 0 3 2 5 5 5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>',
};

// Four hotspots mapped 1:1 onto the 4 Pilar Kurikulum Sekolah Alam, applied to this real place.
const HOTSPOTS = [
  {
    coord: [-6.3659122, 106.8294416],
    pillar: 'Pilar Akhlak',
    color: '#C08A3E',
    icon: ICONS.akhlak,
    title: 'Menjaga apa yang alam titipkan',
    body: 'Danau ini sudah ada jauh sebelum kita lahir, dan akan terus dipakai oleh yang datang setelah kita. Menjaganya adalah bentuk tanggung jawab sederhana yang dimulai dari diri sendiri, bukan karena disuruh.',
    observation: 'Amati sekelilingmu — apakah ada sampah di tepi danau? Jika ada, pungut satu dan buang pada tempatnya.',
    visited: false,
  },
  {
    coord: [-6.367071, 106.8292576],
    pillar: 'Pilar Logika Ilmiah',
    color: '#5FCFA0',
    icon: ICONS.logika,
    title: 'Bagaimana air mengalir?',
    body: 'Air hujan di sekitar kampus meresap ke tanah, mengalir lewat akar-akar pohon, lalu berkumpul di danau ini. Mengamati dari mana air datang dan ke mana ia pergi adalah cara ilmuwan mulai memahami sebab dan akibat.',
    observation: 'Jatuhkan satu daun kering di permukaan air dan amati ke arah mana ia bergerak. Ke mana menurutmu air ini akhirnya mengalir?',
    visited: false,
  },
  {
    coord: [-6.3666896, 106.8314244],
    pillar: 'Pilar Leadership',
    color: '#C2704A',
    icon: ICONS.leadership,
    title: 'Apa yang bisa kamu lakukan untuk danau ini?',
    body: 'Satu orang yang mulai memungut sampah di tepi danau bisa mengajak teman-temannya melakukan hal yang sama. Memimpin tidak selalu berarti jadi yang paling depan — kadang cukup jadi yang pertama bertindak.',
    observation: 'Ajak satu orang di dekatmu untuk sama-sama memperhatikan titik ini selama satu menit, lalu ceritakan apa yang kalian berdua lihat.',
    visited: false,
  },
  {
    coord: [-6.3659744, 106.8303464],
    pillar: 'Pilar Bisnis',
    color: '#3E8FA0',
    icon: ICONS.bisnis,
    title: 'Bagaimana danau ini bisa menghidupi sekitarnya?',
    body: 'Air bersih, udara sejuk, dan pemandangan di sekitar danau adalah sumber daya yang bisa dimanfaatkan tanpa merusaknya — misalnya lewat wisata edukasi. Bisnis yang baik menjaga sumber dayanya agar tetap bisa dipakai di masa depan.',
    observation: 'Perhatikan sekelilingmu — apa satu hal di tempat ini yang bisa bermanfaat bagi orang lain tanpa perlu merusaknya?',
    visited: false,
  }
];

const NEAR_THRESHOLD_M = 700;   // "considered near the lake" radius, covers the wider Danau UI campus area
const CHECKPOINT_RADIUS_M = 30; // how close to a pillar point counts as "arrived"

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

const map = L.map('map', {
  zoomControl: false,
  attributionControl: true,
  minZoom: 14,
  maxZoom: 19,
}).setView([CENTER[0] - 0.01, CENTER[1] - 0.01], 14);

L.control.zoom({ position: 'topright' }).addTo(map);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics | Data StoryGrove / OpenStreetMap',
  maxZoom: 19,
}).addTo(map);

const lakePolygon = L.polygon(LAKE_OUTLINE, {
  color: '#5FCFA0',
  weight: 3,
  opacity: 0.9,
  fillColor: '#5FCFA0',
  fillOpacity: 0.12,
  dashArray: '10 8',
  className: 'lake-outline',
}).addTo(map);

function hotspotHtml(spot) {
  return `<div class="hotspot" style="--accent:${spot.color}"><span class="hotspot-dot"></span></div>`;
}

const overlay = document.getElementById('overlay');
const popupCard = document.getElementById('popupCard');
const popupIcon = document.getElementById('popupIcon');
const popupKicker = document.getElementById('popupKicker');
const popupTitle = document.getElementById('popupTitle');
const popupBody = document.getElementById('popupBody');
const popupClose = document.getElementById('popupClose');
const progress = document.getElementById('progress');
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

const markers = HOTSPOTS.map((spot) => {
  const icon = L.divIcon({ className: '', html: hotspotHtml(spot), iconSize: [22, 22], iconAnchor: [11, 11] });
  const marker = L.marker(spot.coord, { icon }).addTo(map);
  marker.on('click', () => openPopup(spot));
  return marker;
});

function updateProgress() {
  const count = HOTSPOTS.filter((s) => s.visited).length;
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
  HOTSPOTS.forEach((spot, i) => {
    if (spot.visited) return;
    if (haversineMeters(lat, lon, spot.coord[0], spot.coord[1]) <= CHECKPOINT_RADIUS_M) {
      markVisited(spot, i);
    }
  });
}

// ===== User location: real GPS when near the lake, simulated point otherwise =====
let userMarker = null;
const userIcon = L.divIcon({
  className: '',
  html: '<div class="you-here"><span class="you-here-dot"></span></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function placeUserMarker(lat, lon) {
  if (!userMarker) {
    userMarker = L.marker([lat, lon], { icon: userIcon, zIndexOffset: 900 }).addTo(map);
  } else {
    userMarker.setLatLng([lat, lon]);
  }
}

function startRealTracking() {
  legendSub.textContent = 'Lokasimu aktif — dekati tiap titik untuk observasi';
  navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      placeUserMarker(latitude, longitude);
      checkCheckpoints(latitude, longitude);
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
  );
}

function startSimulatedTracking() {
  const start = HOTSPOTS[0].coord;
  placeUserMarker(start[0], start[1]);
  legendSub.textContent = 'Mode simulasi — dekati danau untuk tracking langsung';
}

function initTracking() {
  if (!('geolocation' in navigator)) {
    startSimulatedTracking();
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const dist = haversineMeters(latitude, longitude, CENTER[0], CENTER[1]);
      if (dist <= NEAR_THRESHOLD_M) {
        placeUserMarker(latitude, longitude);
        checkCheckpoints(latitude, longitude);
        startRealTracking();
      } else {
        startSimulatedTracking();
      }
    },
    () => startSimulatedTracking(),
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

updateProgress();

// Cinematic intro: ease in from a wider view down to the lake, then start tracking.
setTimeout(() => {
  map.flyTo(CENTER, 17.3, { duration: 2.6, easeLinearity: 0.25 });
}, 400);
setTimeout(initTracking, 3200);
