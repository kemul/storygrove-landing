// Real shoreline of Danau Kenanga (Danau UI), sourced from OpenStreetMap (way 28994172).
const LAKE_OUTLINE = [[-6.3659122,106.8294416],[-6.3660367,106.8293086],[-6.3661434,106.8292093],[-6.3662727,106.829133],[-6.3663995,106.8290825],[-6.3665992,106.8290544],[-6.3669555,106.8290323],[-6.367071,106.8292576],[-6.367223,106.8295231],[-6.3673589,106.8298075],[-6.3674975,106.8300532],[-6.3675688,106.8301548],[-6.3677461,106.8302856],[-6.3679494,106.8304807],[-6.3679387,106.8305665],[-6.3679134,106.8306631],[-6.3678894,106.8307811],[-6.3678467,106.8308642],[-6.3677348,106.8309554],[-6.3674121,106.8311017],[-6.3666896,106.8314244],[-6.3664126,106.8315281],[-6.3662857,106.8312418],[-6.3660501,106.830738],[-6.3660164,106.8306707],[-6.3658146,106.8306383],[-6.3657584,106.8303775],[-6.3658494,106.8304338],[-6.3659798,106.8304408],[-6.3659744,106.8303464],[-6.3658541,106.830283],[-6.3658306,106.8302703],[-6.365804,106.8302824],[-6.3657482,106.8302195],[-6.3657308,106.8299369],[-6.3657625,106.829684],[-6.3657679,106.8296659],[-6.3658088,106.8295933],[-6.3659122,106.8294416]];

const CENTER = [-6.36658, 106.83015];

const HOTSPOTS = [
  {
    coord: [-6.3659122, 106.8294416],
    kicker: 'Tentang Tempat Ini',
    title: 'Danau Kenanga',
    body: 'Danau Kenanga adalah salah satu danau di kawasan Danau UI, Depok — dikelilingi hutan kota yang dirawat sejak kampus ini dibangun. Airnya berasal dari resapan alami dan menjadi rumah bagi burung, ikan, dan tumbuhan air yang saling bergantung satu sama lain.'
  },
  {
    coord: [-6.367071, 106.8292576],
    kicker: 'Bagaimana Dunia Nyata Bekerja',
    title: 'Bagaimana air mengalir?',
    body: 'Air hujan yang jatuh di sekitar kampus meresap ke tanah, mengalir lewat akar-akar pohon, lalu berkumpul di danau. Dari sini, air mengalir pelan ke danau-danau lain yang saling terhubung, menjaga permukaan air tetap stabil sepanjang tahun.'
  },
  {
    coord: [-6.3666896, 106.8314244],
    kicker: 'Bagaimana Dunia Nyata Bekerja',
    title: 'Mengapa sebuah danau bisa tercemar?',
    body: 'Sampah, sisa sabun, atau minyak yang terbawa air hujan bisa masuk ke danau dan mengganggu keseimbangannya. Ketika air tercemar, oksigen di dalamnya berkurang — ikan dan tumbuhan air kesulitan bertahan hidup.'
  },
  {
    coord: [-6.3659744, 106.8303464],
    kicker: 'Bagaimana Dunia Nyata Bekerja',
    title: 'Bagaimana ekosistem saling bergantung?',
    body: 'Pohon di tepi danau menahan tanah agar tidak longsor ke air. Akarnya jadi tempat ikan kecil bersembunyi. Ikan kecil jadi makanan burung. Setiap bagian ekosistem ini saling menjaga satu sama lain — kalau satu terganggu, yang lain ikut terpengaruh.'
  }
];

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

const hotspotIcon = L.divIcon({
  className: '',
  html: '<div class="hotspot"><span class="hotspot-dot"></span></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const overlay = document.getElementById('overlay');
const popupCard = document.getElementById('popupCard');
const popupKicker = document.getElementById('popupKicker');
const popupTitle = document.getElementById('popupTitle');
const popupBody = document.getElementById('popupBody');
const popupClose = document.getElementById('popupClose');

function openPopup(spot) {
  popupKicker.textContent = spot.kicker;
  popupTitle.textContent = spot.title;
  popupBody.textContent = spot.body;
  overlay.classList.add('open');
  popupCard.classList.add('open');
}
function closePopup() {
  overlay.classList.remove('open');
  popupCard.classList.remove('open');
}
overlay.addEventListener('click', closePopup);
popupClose.addEventListener('click', closePopup);

HOTSPOTS.forEach((spot) => {
  const marker = L.marker(spot.coord, { icon: hotspotIcon }).addTo(map);
  marker.on('click', () => openPopup(spot));
});

// Cinematic intro: ease in from a wider view down to the lake.
setTimeout(() => {
  map.flyTo(CENTER, 17.3, { duration: 2.6, easeLinearity: 0.25 });
}, 400);
