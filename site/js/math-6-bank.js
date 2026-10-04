(function () {
  'use strict';

  var letters = ['A', 'B', 'C', 'D'];

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function choice(items) {
    return items[rand(0, items.length - 1)];
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = rand(0, i);
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function gcd(a, b) {
    var x = Math.abs(a);
    var y = Math.abs(b);
    while (y) {
      var t = y;
      y = x % y;
      x = t;
    }
    return x;
  }

  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  function rupiah(value) {
    return 'Rp' + value.toLocaleString('id-ID') + ',00';
  }

  function unit(value, suffix) {
    return String(value).replace('.', ',') + ' ' + suffix;
  }

  function formatDecimal(value) {
    return String(value).replace('.', ',');
  }

  function formatClock(totalMinutes) {
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    return String(hours).padStart(2, '0') + '.' + String(minutes).padStart(2, '0');
  }

  function makeOptions(correct, distractors) {
    var normalized = [];
    [correct].concat(distractors).forEach(function (item) {
      var text = String(item);
      if (normalized.indexOf(text) === -1) normalized.push(text);
    });
    while (normalized.length < 4) normalized.push(String(Number(correct) + rand(1, 9)));
    var selected = shuffle(normalized.slice(0, 4));
    return {
      options: selected.map(function (text, index) {
        return { id: letters[index], text: text };
      }),
      answer: letters[selected.indexOf(String(correct))]
    };
  }

  function question(config) {
    var opt = makeOptions(config.correct, config.distractors);
    return {
      id: config.id,
      topic: config.topic,
      title: config.title,
      context: config.context,
      prompt: config.prompt,
      visual: config.visual,
      options: opt.options,
      answer: opt.answer,
      correctText: String(config.correct),
      explanation: config.explanation,
      solutionSteps: config.solutionSteps || String(config.explanation).split('. ').filter(Boolean)
    };
  }

  var generators = [
    function () {
      var baskets = rand(3, 5);
      var perBasket = choice([36, 42, 45, 48]);
      var sold = choice([54, 72, 75, 84]);
      var bought = choice([45, 60, 65, 80]);
      var correct = baskets * perBasket - sold + bought;
      return question({
        id: 'inventory-eggs',
        topic: 'Operasi bilangan',
        title: 'Stok telur',
        context: 'Setiap pagi Pak Raka mengecek stok telur sebelum warung dibuka. Di raknya ada ' + baskets + ' keranjang telur. Setiap keranjang berisi ' + perBasket + ' butir. Pada jam pertama, pelanggan membeli ' + sold + ' butir. Setelah itu pemasok datang membawa tambahan ' + bought + ' butir telur.',
        prompt: 'Berdasarkan catatan tersebut, berapa butir telur yang tersedia sekarang?',
        correct: correct + ' butir',
        distractors: [(baskets * perBasket - sold) + ' butir', (baskets * perBasket + bought) + ' butir', (correct + 25) + ' butir'],
        explanation: 'Stok awal = ' + baskets + ' x ' + perBasket + ' = ' + (baskets * perBasket) + '. Setelah transaksi: ' + (baskets * perBasket) + ' - ' + sold + ' + ' + bought + ' = ' + correct + ' butir.',
        visual: { type: 'stats', title: 'Catatan stok', stats: [[baskets + 'x', 'keranjang'], [perBasket, 'per keranjang'], ['-' + sold + ' +' + bought, 'transaksi']] }
      });
    },
    function () {
      var a = choice([28, 34, 42, 56]);
      var divisor = choice([2, 4, 7]);
      var b = choice([12, 16, 18]);
      var c = choice([9, 11, 13]);
      var m = choice([3, 4, 5]);
      var correct = (a / -divisor) - b + (-c * m);
      return question({
        id: 'integer-expression',
        topic: 'Operasi bilangan',
        title: 'Bilangan bulat',
        context: 'Dalam permainan papan bilangan, Dika mendapat kartu operasi. Nilai akhir kartunya ditentukan dari urutan operasi ' + a + ' : (-' + divisor + ') - ' + b + ' + (-' + c + ') x ' + m + '. Dika harus mengerjakan operasi bagi dan kali lebih dahulu.',
        prompt: 'Berapa nilai akhir kartu Dika?',
        correct: correct,
        distractors: [correct + b, correct - m, Math.abs(correct), -correct - divisor],
        explanation: 'Kerjakan bagi dan kali lebih dulu: ' + a + ' : (-' + divisor + ') = ' + (a / -divisor) + ', lalu (-' + c + ') x ' + m + ' = ' + (-c * m) + '. Jadi hasilnya ' + correct + '.',
        visual: { type: 'equation', title: 'Urutan operasi', html: a + ' : (-' + divisor + ')<br>- ' + b + ' + (-' + c + ') x ' + m }
      });
    },
    function () {
      var values = choice([[48, 56, 126], [18, 24, 30], [32, 40, 60]]);
      var correct = lcm(lcm(values[0], values[1]), values[2]);
      return question({
        id: 'lcm-three',
        topic: 'KPK dan FPB',
        title: 'Kelipatan persekutuan',
        context: 'Tiga lampu hias di taman sekolah menyala berulang. Lampu pertama menyala setiap ' + values[0] + ' detik, lampu kedua setiap ' + values[1] + ' detik, dan lampu ketiga setiap ' + values[2] + ' detik. Ketiganya baru saja menyala bersama.',
        prompt: 'Berapa detik lagi ketiga lampu akan menyala bersama untuk pertama kali?',
        correct: correct,
        distractors: [correct / 2, correct + values[2], correct - values[1]],
        explanation: 'KPK diambil dari faktor prima dengan pangkat terbesar. Untuk ' + values.join(', ') + ', KPK-nya adalah ' + correct + '.',
        visual: { type: 'equation', title: 'KPK', html: values.join(' &nbsp;•&nbsp; ') }
      });
    },
    function () {
      var values = choice([[144, 54, 72], [120, 75, 45], [96, 64, 80]]);
      var correct = gcd(gcd(values[0], values[1]), values[2]);
      return question({
        id: 'gcd-sharing',
        topic: 'KPK dan FPB',
        title: 'Membagi sama banyak',
        context: 'Panitia bakti sosial ingin membuat paket camilan yang isinya sama persis. Mereka mempunyai ' + values[0] + ' permen, ' + values[1] + ' cokelat, dan ' + values[2] + ' biskuit. Semua camilan harus habis dibagi ke dalam paket.',
        prompt: 'Paling banyak berapa anak yang dapat menerima paket dengan isi sama?',
        correct: correct + ' anak',
        distractors: [(correct / 2) + ' anak', (correct + 6) + ' anak', (correct * 2) + ' anak'],
        explanation: 'Karena semua jenis harus terbagi sama banyak, gunakan FPB dari ' + values.join(', ') + '. FPB-nya ' + correct + ', jadi ada ' + correct + ' anak.',
        visual: { type: 'stats', title: 'Isi paket', stats: [[values[0], 'permen'], [values[1], 'cokelat'], [values[2], 'biskuit']] }
      });
    },
    function () {
      var pair = choice([[48, 72], [36, 60], [42, 56]]);
      var divisor = gcd(pair[0], pair[1]);
      var correct = (pair[0] / divisor) + '/' + (pair[1] / divisor);
      return question({
        id: 'simplify-fraction',
        topic: 'Pecahan',
        title: 'Menyederhanakan pecahan',
        context: 'Di poster kelas, bagian tanaman yang sudah disiram ditulis sebagai pecahan ' + pair[0] + '/' + pair[1] + '. Agar mudah dibaca adik kelas, pecahan itu perlu ditulis dalam bentuk paling sederhana.',
        prompt: 'Bentuk sederhana dari pecahan tersebut adalah ...',
        correct: correct,
        distractors: [(pair[0] / 2) + '/' + (pair[1] / 2), '1/2', '3/4'],
        explanation: 'FPB dari ' + pair[0] + ' dan ' + pair[1] + ' adalah ' + divisor + '. Bagi pembilang dan penyebut dengan ' + divisor + ', hasilnya ' + correct + '.',
        visual: { type: 'fraction', title: pair[0] + '/' + pair[1] }
      });
    },
    function () {
      var numerator = choice([3, 5, 7]);
      var denominator = choice([8, 10]);
      var decimal = choice([0.24, 0.48, 0.56]);
      var value = numerator / denominator * decimal;
      var asTenths = Math.round(value * 100) / 100;
      var correct = asTenths === 0.3 ? '3/10' : String(asTenths).replace('.', ',');
      return question({
        id: 'fraction-decimal',
        topic: 'Pecahan',
        title: 'Pecahan dan desimal',
        context: 'Saat membuat minuman untuk kegiatan kelas, Lani memakai ' + numerator + '/' + denominator + ' bagian dari sebotol sirup. Satu botol sirup berisi ' + String(decimal).replace('.', ',') + ' liter. Ia ingin mengetahui banyak sirup yang benar-benar dipakai.',
        prompt: 'Berapa liter sirup yang dipakai Lani?',
        correct: correct,
        distractors: ['1/5', '3/5', '3/7'],
        explanation: numerator + '/' + denominator + ' dikalikan ' + decimal + ' menghasilkan ' + asTenths + '. Jika ditulis sebagai pecahan sederhana, pilih bentuk yang nilainya sama.',
        visual: { type: 'equation', title: 'Pecahan x desimal', html: numerator + '/' + denominator + '<br>x ' + String(decimal).replace('.', ',') }
      });
    },
    function () {
      var scenario = choice([
        { total: 11.2, used: [2.25, 3.4, 1.95, 1.75], labels: ['Ayah 2 1/4 m', 'Ibu 3 2/5 m', 'Kakak 1,95 m', 'Adik 1,75 m'] },
        { total: 12.5, used: [2.5, 3.25, 2.1, 1.65], labels: ['Ayah 2 1/2 m', 'Ibu 3 1/4 m', 'Kakak 2,1 m', 'Adik 1,65 m'] },
        { total: 10.75, used: [1.75, 2.4, 1.8, 2.05], labels: ['Ayah 1 3/4 m', 'Ibu 2 2/5 m', 'Kakak 1,8 m', 'Adik 2,05 m'] }
      ]);
      var total = scenario.total;
      var used = scenario.used;
      var usedTotal = Math.round(used.reduce(function (sum, item) { return sum + item; }, 0) * 100) / 100;
      var correct = Math.round((total - used.reduce(function (sum, item) { return sum + item; }, 0)) * 100) / 100;
      return question({
        id: 'fabric-left',
        topic: 'Pecahan',
        title: 'Sisa panjang kain',
        context: 'Vira membeli kain sepanjang ' + formatDecimal(total) + ' m untuk membuat baju keluarga. Catatan penggunaan kainnya adalah: ' + scenario.labels.join(', ') + '. Setelah semua bagian dipotong, Vira ingin menyimpan sisa kain untuk hiasan kecil.',
        prompt: 'Berapa meter kain yang tersisa?',
        correct: unit(correct, 'm'),
        distractors: [unit(Math.max(0.5, correct - 0.3), 'm'), unit(correct + 0.45, 'm'), unit(usedTotal - total > 0 ? usedTotal - total : correct + 0.8, 'm')],
        explanation: 'Ubah pecahan campuran menjadi desimal lalu jumlahkan seluruh kain yang terpakai. Total terpakai = ' + unit(usedTotal, 'm') + '. Sisa = ' + formatDecimal(total) + ' - ' + formatDecimal(usedTotal) + ' = ' + unit(correct, 'm') + '.',
        solutionSteps: ['Ubah pecahan campuran menjadi desimal.', 'Jumlah kain terpakai = ' + scenario.labels.join(' + ') + ' = ' + unit(usedTotal, 'm') + '.', 'Sisa kain = ' + formatDecimal(total) + ' - ' + formatDecimal(usedTotal) + ' = ' + unit(correct, 'm') + '.'],
        visual: { type: 'bar', title: 'Kain ' + formatDecimal(total) + ' m', segments: ['Ayah', 'Ibu', 'Kakak', 'Adik', 'Sisa'] }
      });
    },
    function () {
      var ratio = choice([[4, 5], [3, 5], [2, 7]]);
      var total = ratio[0] + ratio[1] === 9 ? 540000 : 450000;
      var correct = total / (ratio[0] + ratio[1]) * ratio[1];
      return question({
        id: 'money-ratio',
        topic: 'Perbandingan',
        title: 'Perbandingan uang',
        context: 'Fani dan Siska mengumpulkan uang untuk membeli perlengkapan pentas kelas. Perbandingan uang Fani dan Siska adalah ' + ratio[0] + ' : ' + ratio[1] + '. Jika uang mereka digabung, jumlahnya menjadi ' + rupiah(total) + '.',
        prompt: 'Berapa rupiah uang milik Siska?',
        correct: rupiah(correct),
        distractors: [rupiah(correct - 60000), rupiah(correct + 60000), rupiah(total - correct)],
        explanation: 'Total bagian = ' + (ratio[0] + ratio[1]) + '. Bagian Siska = ' + ratio[1] + '/' + (ratio[0] + ratio[1]) + ' x ' + rupiah(total) + ' = ' + rupiah(correct) + '.',
        visual: { type: 'ratio', title: 'Fani : Siska', labels: ['Fani ' + ratio[0], 'Siska ' + ratio[1]], widths: [ratio[0], ratio[1]] }
      });
    },
    function () {
      var kodi = choice([50, 70, 80]);
      var dozen = choice([18, 21, 25]);
      var produced = choice([1100, 1350, 1500]);
      var ordered = kodi * 20 + dozen * 12;
      var correct = ordered - produced;
      return question({
        id: 'kodi-lusin',
        topic: 'Satuan',
        title: 'Kodi dan lusin',
        context: 'Unit usaha sekolah menerima pesanan sapu tangan untuk kegiatan pramuka. Pesanan tertulis sebanyak ' + kodi + ' kodi dan ' + dozen + ' lusin. Hingga sore hari, tim produksi sudah menyelesaikan ' + produced.toLocaleString('id-ID') + ' sapu tangan.',
        prompt: 'Berapa sapu tangan yang masih harus diproduksi?',
        correct: correct + ' buah',
        distractors: [(correct + 50) + ' buah', Math.abs(correct - 100) + ' buah', (ordered - produced + 120) + ' buah'],
        explanation: '1 kodi = 20 buah dan 1 lusin = 12 buah. Total pesanan = ' + kodi + ' x 20 + ' + dozen + ' x 12 = ' + ordered + '. Sisa = ' + ordered + ' - ' + produced + ' = ' + correct + '.',
        visual: { type: 'stats', title: 'Konversi pesanan', stats: [[kodi, 'kodi'], [dozen, 'lusin'], [produced, 'selesai']] }
      });
    },
    function () {
      var data = choice([
        { m3: 0.46, liter: 60, cm3: 140000, bottle: 5.5 },
        { m3: 0.36, liter: 84, cm3: 120000, bottle: 6 },
        { m3: 0.25, liter: 75, cm3: 125000, bottle: 5 },
        { m3: 0.18, liter: 90, cm3: 90000, bottle: 4.5 }
      ]);
      var m3Liters = data.m3 * 1000;
      var cm3Liters = data.cm3 / 1000;
      var totalLiters = m3Liters + data.liter + cm3Liters;
      var bottle = data.bottle;
      var correct = totalLiters / bottle;
      return question({
        id: 'volume-conversion',
        topic: 'Satuan',
        title: 'Konversi volume',
        context: 'Petugas koperasi sekolah memindahkan bensin cadangan dari tiga wadah ke botol ukur. Wadah pertama berisi ' + formatDecimal(data.m3) + ' m³, wadah kedua ' + data.liter + ' liter, dan wadah ketiga ' + data.cm3.toLocaleString('id-ID') + ' cm³. Semua bensin akan dimasukkan ke botol yang masing-masing menampung ' + formatDecimal(bottle) + ' liter.',
        prompt: 'Berapa botol yang diperlukan agar semua bensin tertampung?',
        correct: correct + ' botol',
        distractors: [(correct - 10) + ' botol', (correct + 10) + ' botol', (correct + 20) + ' botol'],
        explanation: formatDecimal(data.m3) + ' m³ = ' + m3Liters + ' liter dan ' + data.cm3.toLocaleString('id-ID') + ' cm³ = ' + cm3Liters + ' liter. Total = ' + m3Liters + ' + ' + data.liter + ' + ' + cm3Liters + ' = ' + totalLiters + ' liter. ' + totalLiters + ' : ' + formatDecimal(bottle) + ' = ' + correct + ' botol.',
        solutionSteps: ['Samakan satuan ke liter.', formatDecimal(data.m3) + ' m³ = ' + m3Liters + ' L, dan ' + data.cm3.toLocaleString('id-ID') + ' cm³ = ' + cm3Liters + ' L.', 'Total bensin = ' + totalLiters + ' L.', 'Jumlah botol = ' + totalLiters + ' : ' + formatDecimal(bottle) + ' = ' + correct + ' botol.'],
        visual: { type: 'stats', title: 'Semua ke liter', stats: [[formatDecimal(data.m3) + ' m³', m3Liters + ' L'], [data.liter + ' L', data.liter + ' L'], [data.cm3.toLocaleString('id-ID') + ' cm³', cm3Liters + ' L']] }
      });
    },
    function () {
      var capacity = choice([60, 72, 90]);
      var minutes = choice([15, 18, 30]);
      var correct = capacity / minutes * 60;
      return question({
        id: 'water-flow',
        topic: 'Satuan',
        title: 'Debit air',
        context: 'Di pojok kelas ada akuarium kecil untuk pengamatan ikan. Sebelum kegiatan dimulai, akuarium dalam keadaan kosong. Petugas kelas membuka selang dengan aliran yang tetap. Setelah ' + minutes + ' menit, akuarium yang berkapasitas ' + capacity + ' liter terisi penuh.',
        prompt: 'Jika aliran air tetap sama, berapa debit air dari selang tersebut dalam liter per jam?',
        correct: correct + ' liter/jam',
        distractors: [(correct / 2) + ' liter/jam', (correct + 120) + ' liter/jam', (correct - 40) + ' liter/jam'],
        explanation: 'Debit per menit = ' + capacity + ' : ' + minutes + ' = ' + (capacity / minutes) + ' liter/menit. Dalam 1 jam: ' + (capacity / minutes) + ' x 60 = ' + correct + ' liter/jam.',
        visual: { type: 'equation', title: 'Debit', html: capacity + ' liter<br>' + minutes + ' menit' }
      });
    },
    function () {
      var pair = choice([[45, 18], [60, 24], [75, 30], [80, 20], [100, 25]]);
      var actualMeter = pair[0];
      var modelCm = pair[1];
      var actualCm = actualMeter * 100;
      var scale = actualCm / modelCm;
      return question({
        id: 'scale-plane',
        topic: 'Skala',
        title: 'Skala miniatur',
        context: 'Kelompok Raka membuat miniatur pesawat untuk pameran sekolah. Di buku referensi, panjang pesawat sebenarnya adalah ' + actualMeter + ' m. Pada miniatur yang mereka buat, panjang pesawat menjadi ' + modelCm + ' cm.',
        prompt: 'Skala yang digunakan kelompok Raka adalah ...',
        correct: '1 : ' + scale.toLocaleString('id-ID'),
        distractors: ['1 : ' + (scale * 10).toLocaleString('id-ID'), '1 : ' + Math.round(scale / 10).toLocaleString('id-ID'), '1 : ' + (scale + 250).toLocaleString('id-ID')],
        explanation: actualMeter + ' m = ' + actualCm + ' cm. Skala = ukuran miniatur : ukuran sebenarnya = ' + modelCm + ' : ' + actualCm + ' = 1 : ' + scale + '.',
        visual: { type: 'bar', title: 'Model vs nyata', segments: ['Miniatur', 'Ukuran sebenarnya'] }
      });
    },
    function () {
      var scenario = choice([
        { distance: 126, speeds: [60, 48], start: '07.20', startMinutes: 440 },
        { distance: 116, speeds: [56, 60], start: '07.38', startMinutes: 458 },
        { distance: 150, speeds: [45, 55], start: '06.45', startMinutes: 405 },
        { distance: 180, speeds: [52, 68], start: '07.10', startMinutes: 430 }
      ]);
      var distance = scenario.distance;
      var speeds = scenario.speeds;
      var minutes = distance / (speeds[0] + speeds[1]) * 60;
      var correct = formatClock(scenario.startMinutes + minutes);
      return question({
        id: 'meet-speed',
        topic: 'Kecepatan',
        title: 'Berpapasan',
        context: 'Arman dan Doni tinggal di kota yang berbeda. Mereka berangkat pada pukul ' + scenario.start + ' dari arah berlawanan melalui jalan yang sama. Arman melaju dari kota P ke Q dengan kecepatan ' + speeds[0] + ' km/jam, sedangkan Doni dari kota Q ke P dengan kecepatan ' + speeds[1] + ' km/jam. Jarak kedua kota adalah ' + distance + ' km.',
        prompt: 'Pada pukul berapa mereka akan berpapasan?',
        correct: correct,
        distractors: [formatClock(scenario.startMinutes + minutes - 10), formatClock(scenario.startMinutes + minutes + 10), formatClock(scenario.startMinutes + minutes + 20)],
        explanation: 'Kecepatan gabungan = ' + speeds[0] + ' + ' + speeds[1] + ' = ' + (speeds[0] + speeds[1]) + ' km/jam. Waktu bertemu = ' + distance + ' : ' + (speeds[0] + speeds[1]) + ' jam = ' + minutes + ' menit. ' + scenario.start + ' + ' + minutes + ' menit = ' + correct + '.',
        visual: { type: 'equation', title: 'Gerak saling mendekat', html: distance + ' km<br>' + speeds[0] + ' + ' + speeds[1] + ' km/jam' }
      });
    },
    function () {
      var x1 = choice([-5, -4, -3, -2]);
      var y1 = choice([-2, -1, 1]);
      var x2 = choice([1, 2, 3, 4]);
      var y2 = choice([4, 5, 6]);
      return question({
        id: 'coordinate-rectangle',
        topic: 'Koordinat',
        title: 'Titik koordinat',
        context: 'Pada denah taman sekolah, tiga sudut area baca diberi tanda A(' + x1 + ', ' + y2 + '), B(' + x1 + ', ' + y1 + '), dan C(' + x2 + ', ' + y1 + '). Area baca akan dibuat berbentuk persegi panjang, sehingga satu titik sudut lagi perlu ditentukan.',
        prompt: 'Koordinat titik D yang melengkapi persegi panjang ABCD adalah ...',
        correct: '(' + x2 + ', ' + y2 + ')',
        distractors: ['(' + x1 + ', ' + y1 + ')', '(' + x2 + ', ' + y1 + ')', '(' + x1 + ', ' + y2 + ')'],
        explanation: 'Titik D harus sejajar dengan A pada garis y = ' + y2 + ' dan sejajar dengan C pada garis x = ' + x2 + '. Jadi D = (' + x2 + ', ' + y2 + ').',
        visual: { type: 'coordinate', title: 'Bidang koordinat' }
      });
    },
    function () {
      var scenario = choice([
        {
          answer: 'Layang-layang',
        prompt: 'Rani mengamati sebuah pola kain. Pola itu memiliki dua pasang sisi berdekatan yang sama panjang, sepasang sudut berhadapan sama besar, dan diagonal saling tegak lurus. Bentuk pola kain tersebut adalah ...',
          distractors: ['Jajar genjang', 'Trapesium sama kaki', 'Persegi panjang'],
          explanation: 'Ciri utama layang-layang adalah dua pasang sisi berdekatan sama panjang dan diagonalnya saling tegak lurus.'
        },
        {
          answer: 'Jajar genjang',
        prompt: 'Di halaman sekolah, petugas menggambar bentuk untuk lapangan permainan. Bentuk itu memiliki dua pasang sisi berhadapan sama panjang dan sejajar, serta sudut-sudut yang berhadapan sama besar. Bentuk lapangan tersebut adalah ...',
          distractors: ['Layang-layang', 'Trapesium sama kaki', 'Belah ketupat'],
          explanation: 'Jajar genjang memiliki sisi berhadapan yang sejajar dan sama panjang, dengan sudut berhadapan sama besar.'
        },
        {
          answer: 'Trapesium sama kaki',
        prompt: 'Sebuah papan petunjuk di taman dibuat dengan satu pasang sisi sejajar, dua kaki sama panjang, dan sudut-sudut alas sama besar. Bentuk papan tersebut adalah ...',
          distractors: ['Persegi panjang', 'Jajar genjang', 'Layang-layang'],
          explanation: 'Trapesium sama kaki memiliki satu pasang sisi sejajar dan dua sisi kaki yang sama panjang.'
        }
      ]);
      return question({
        id: 'shape-property',
        topic: 'Bangun datar',
        title: 'Sifat bangun datar',
        context: 'Siswa diminta mengenali bangun datar dari ciri-ciri yang muncul dalam cerita.',
        prompt: scenario.prompt,
        correct: scenario.answer,
        distractors: scenario.distractors,
        explanation: scenario.explanation,
        visual: { type: 'shape', title: 'Ciri bangun' }
      });
    },
    function () {
      var side = choice([60, 70, 80]);
      var areaM2 = side * side / 10000;
      return question({
        id: 'square-cloth',
        topic: 'Bangun datar',
        title: 'Luas persegi',
        context: 'Ibu ingin membuat taplak untuk meja kecil di ruang baca. Bentuk taplak yang dipilih adalah persegi agar mudah dipasang. Setiap sisi taplak berukuran ' + side + ' cm.',
        prompt: 'Berapa meter persegi luas kain yang diperlukan?',
        correct: String(areaM2).replace('.', ',') + ' m²',
        distractors: [String(areaM2 / 2).replace('.', ',') + ' m²', String(areaM2 + 0.2).replace('.', ',') + ' m²', (side * side) + ' m²'],
        explanation: 'Luas persegi = sisi x sisi = ' + side + ' x ' + side + ' = ' + (side * side) + ' cm². Karena 10.000 cm² = 1 m², hasilnya ' + String(areaM2).replace('.', ',') + ' m².',
        visual: { type: 'shape', title: 'Persegi ' + side + ' cm' }
      });
    },
    function () {
      var data = choice([
        { baseCm: 24, heightDm: 15 },
        { baseCm: 36, heightDm: 12 },
        { baseCm: 45, heightDm: 8 },
        { baseCm: 18, heightDm: 20 }
      ]);
      var baseDm = data.baseCm / 10;
      var correct = baseDm * data.heightDm;
      return question({
        id: 'parallelogram-area',
        topic: 'Bangun datar',
        title: 'Luas jajar genjang',
        context: 'Pada kegiatan seni, siswa membuat hiasan berbentuk jajar genjang dari karton. Alas hiasan tertulis ' + data.baseCm + ' cm, sedangkan tingginya tertulis ' + data.heightDm + ' dm. Guru meminta luasnya ditulis dalam satuan dm².',
        prompt: 'Berapa luas hiasan karton tersebut?',
        correct: correct + ' dm²',
        distractors: [(correct * 10) + ' dm²', formatDecimal(correct / 10) + ' dm²', (data.baseCm * data.heightDm) + ' dm²'],
        explanation: data.baseCm + ' cm = ' + formatDecimal(baseDm) + ' dm. Luas jajar genjang = alas x tinggi = ' + formatDecimal(baseDm) + ' x ' + data.heightDm + ' = ' + correct + ' dm².',
        visual: { type: 'shape', title: 'Jajar genjang' }
      });
    },
    function () {
      var diameter = choice([14, 28, 42]);
      var correct = 22 / 7 * diameter;
      return question({
        id: 'circle-circumference',
        topic: 'Lingkaran',
        title: 'Keliling lingkaran',
        context: 'Sebuah taman baca akan diberi pita di tepi alas meja berbentuk lingkaran. Pada gambar rencana, garis putus-putus menunjukkan diameter meja sepanjang ' + diameter + ' cm.',
        prompt: 'Berapa panjang pita yang dibutuhkan untuk mengelilingi tepi meja?',
        correct: correct + ' cm',
        distractors: [(correct / 2) + ' cm', (correct * 2) + ' cm', (diameter * diameter) + ' cm'],
        explanation: 'Keliling lingkaran = π x diameter. Dengan π = 22/7, keliling = 22/7 x ' + diameter + ' = ' + correct + ' cm.',
        visual: { type: 'circle', title: 'Diameter ' + diameter + ' cm' }
      });
    },
    function () {
      var radius = 7;
      var height = choice([10, 15, 20]);
      var correct = 22 / 7 * radius * radius * height;
      return question({
        id: 'cylinder-volume',
        topic: 'Bangun ruang',
        title: 'Volume tabung',
        context: 'Kelompok sains mengukur sebuah wadah berbentuk tabung untuk menyimpan biji tanaman. Diameter alas wadah adalah 14 cm dan tingginya ' + height + ' cm. Mereka perlu mengetahui kapasitas ruang di dalam wadah.',
        prompt: 'Berapa volume wadah tabung tersebut?',
        correct: correct.toLocaleString('id-ID') + ' cm³',
        distractors: [(correct - 220).toLocaleString('id-ID') + ' cm³', (correct + 440).toLocaleString('id-ID') + ' cm³', (radius * height * 22).toLocaleString('id-ID') + ' cm³'],
        explanation: 'Jari-jari = 14 : 2 = 7 cm. Volume = π x r² x t = 22/7 x 7 x 7 x ' + height + ' = ' + correct.toLocaleString('id-ID') + ' cm³.',
        visual: { type: 'cylinder', title: 'd = 14 cm, t = ' + height + ' cm' }
      });
    },
    function () {
      var side = choice([8, 10, 12]);
      var correct = 6 * side * side;
      return question({
        id: 'cube-surface',
        topic: 'Bangun ruang',
        title: 'Luas permukaan kubus',
        context: 'Alya ingin membungkus kotak kado berbentuk kubus dengan kertas warna. Setiap rusuk kotak berukuran ' + side + ' cm. Kertas harus menutup seluruh permukaan kotak.',
        prompt: 'Berapa luas kertas minimum yang diperlukan?',
        correct: correct + ' cm²',
        distractors: [(correct + 100) + ' cm²', (correct - 18) + ' cm²', (side * side * side) + ' cm²'],
        explanation: 'Luas permukaan kubus = 6 x sisi² = 6 x ' + side + '² = ' + correct + ' cm².',
        visual: { type: 'cube', title: 'Rusuk ' + side + ' cm' }
      });
    },
    function () {
      var rows = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].map(function (month) {
        return [month, choice([5, 10, 15, 20, 25, 30])];
      });
      var total = rows.reduce(function (sum, row) { return sum + row[1]; }, 0);
      var correct = Math.round(total / rows.length * 10) / 10;
      return question({
        id: 'average-table',
        topic: 'Data',
        title: 'Rata-rata data',
        context: 'Toko Tani Makmur mencatat penjualan pupuk selama enam bulan pada tabel. Pemilik toko ingin mengetahui rata-rata penjualan agar dapat memperkirakan persediaan bulan berikutnya.',
        prompt: 'Berdasarkan data pada tabel, berapa rata-rata penjualan pupuk setiap bulan?',
        correct: unit(correct, 'ton'),
        distractors: [unit(correct + 5, 'ton'), unit(Math.max(5, correct - 5), 'ton'), unit(Math.round(total / 5 * 10) / 10, 'ton')],
        explanation: 'Jumlah seluruh penjualan = ' + total + ' ton. Banyak data = 6. Rata-rata = ' + total + ' : 6 = ' + unit(correct, 'ton') + '.',
        visual: { type: 'table', title: 'Penjualan pupuk', rows: rows }
      });
    },
    function () {
      var sets = [
        { values: [7, 10, 8, 7, 8, 6, 9, 7, 5, 8, 6, 7, 4], answer: '7 dan 7' },
        { values: [6, 8, 9, 6, 7, 6, 10, 8, 5, 6, 7, 9, 6], answer: '6 dan 7' },
        { values: [8, 7, 8, 9, 10, 8, 6, 7, 8, 5, 9, 8, 7], answer: '8 dan 8' }
      ];
      var data = choice(sets);
      return question({
        id: 'mode-median',
        topic: 'Data',
        title: 'Modus dan median',
        context: 'Guru matematika mencatat nilai kuis dari sekelompok siswa: ' + data.values.join(', ') + '. Guru ingin melihat nilai yang paling sering muncul dan nilai tengah dari data tersebut.',
        prompt: 'Modus dan median dari data nilai tersebut adalah ...',
        correct: data.answer,
        distractors: ['7 dan 8', '8 dan 7', '6 dan 8'],
        explanation: 'Modus adalah angka yang paling sering muncul. Median adalah nilai tengah setelah data diurutkan. Dari data tersebut, jawabannya ' + data.answer + '.',
        visual: { type: 'equation', title: 'Data nilai', html: data.values.slice(0, 7).join(' ') + '<br>' + data.values.slice(7).join(' ') }
      });
    },
    function () {
      var totalStudents = choice([20, 30, 40]);
      var sportPercent = choice([20, 25, 30, 40]);
      var correct = totalStudents * sportPercent / 100;
      return question({
        id: 'pie-sports',
        topic: 'Data',
        title: 'Diagram lingkaran',
        context: 'Kelas VI membuat survei kegemaran untuk menentukan kegiatan Jumat ceria. Hasilnya ditampilkan dalam diagram lingkaran. Jumlah seluruh siswa yang mengisi survei adalah ' + totalStudents + ' anak, dan bagian olahraga pada diagram sebesar ' + sportPercent + '%.',
        prompt: 'Berapa siswa yang memilih kegiatan olahraga?',
        correct: correct + ' siswa',
        distractors: [(correct + 2) + ' siswa', Math.max(1, correct - 2) + ' siswa', (correct * 2) + ' siswa'],
        explanation: 'Olahraga = ' + sportPercent + '% dari ' + totalStudents + ' siswa. ' + sportPercent + '/100 x ' + totalStudents + ' = ' + correct + ' siswa.',
        visual: { type: 'pie', title: 'Kegemaran siswa', sportPercent: sportPercent }
      });
    },
    function () {
      var red = choice([5, 6, 8]);
      var blue = choice([4, 5, 7]);
      var green = choice([3, 4, 6]);
      var total = red + blue + green;
      var wanted = blue + green;
      var divisor = gcd(wanted, total);
      return question({
        id: 'probability-ball',
        topic: 'Peluang',
        title: 'Peluang sederhana',
        context: 'Pada permainan peluang di kelas, guru memasukkan ' + red + ' bola merah, ' + blue + ' bola biru, dan ' + green + ' bola hijau ke dalam sebuah kotak. Seorang siswa mengambil satu bola tanpa melihat isi kotak.',
        prompt: 'Peluang siswa tersebut mengambil bola hijau atau biru adalah ...',
        correct: (wanted / divisor) + '/' + (total / divisor),
        distractors: [blue + '/' + total, green + '/' + total, red + '/' + total],
        explanation: 'Jumlah bola = ' + red + ' + ' + blue + ' + ' + green + ' = ' + total + '. Bola hijau atau biru = ' + green + ' + ' + blue + ' = ' + wanted + '. Peluang = ' + wanted + '/' + total + ' = ' + ((wanted / divisor) + '/' + (total / divisor)) + '.',
        visual: { type: 'stats', title: 'Isi kotak', stats: [[red, 'merah'], [blue, 'biru'], [green, 'hijau']] }
      });
    },
    function () {
      var scenario = choice([
        { ages: [7, 2], total: 54, name: 'Ayah dan Dika', target: 'Ayah' },
        { ages: [5, 3], total: 64, name: 'Kakak dan Adik', target: 'Kakak' },
        { ages: [4, 1], total: 45, name: 'Ibu dan Rani', target: 'Ibu' }
      ]);
      var ages = scenario.ages;
      var total = scenario.total;
      var unitAge = total / (ages[0] + ages[1]);
      var correct = ages[0] * unitAge;
      return question({
        id: 'age-ratio',
        topic: 'Perbandingan',
        title: 'Perbandingan umur',
        context: 'Dalam kegiatan wawancara keluarga, seorang siswa mencatat bahwa perbandingan umur ' + scenario.name + ' adalah ' + ages[0] + ' : ' + ages[1] + '. Setelah dijumlahkan, umur keduanya adalah ' + total + ' tahun.',
        prompt: 'Dari informasi perbandingan dan jumlah umur tersebut, berapa umur ' + scenario.target + ' sekarang?',
        correct: correct + ' tahun',
        distractors: [(ages[1] * unitAge) + ' tahun', (correct - unitAge) + ' tahun', (correct + unitAge) + ' tahun'],
        explanation: 'Total bagian = ' + ages[0] + ' + ' + ages[1] + ' = ' + (ages[0] + ages[1]) + '. Satu bagian = ' + total + ' : ' + (ages[0] + ages[1]) + ' = ' + unitAge + ' tahun. Umur ' + scenario.target + ' = ' + ages[0] + ' x ' + unitAge + ' = ' + correct + ' tahun.',
        visual: { type: 'ratio', title: scenario.name, labels: [scenario.target + ' ' + ages[0], 'Pasangan ' + ages[1]], widths: ages }
      });
    },
    function () {
      var data = choice([
        [120, 125, 130, 135, 140, 145],
        [118, 122, 126, 130, 134, 138],
        [124, 128, 132, 136, 140, 144],
        [115, 120, 125, 130, 135, 140]
      ]);
      var sum = data.reduce(function (total, value) { return total + value; }, 0);
      var correct = sum / data.length;
      return question({
        id: 'height-average',
        topic: 'Data',
        title: 'Rata-rata tinggi badan',
        context: 'Petugas UKS mencatat tinggi badan beberapa siswa untuk laporan kesehatan. Data yang tercatat adalah ' + data.join(', ') + ' cm.',
        prompt: 'Berapa rata-rata tinggi badan siswa pada data tersebut?',
        correct: correct + ' cm',
        distractors: [(correct - 5) + ' cm', (correct + 2) + ' cm', (correct + 5) + ' cm'],
        explanation: 'Jumlah data = ' + sum + '. Banyak data = 6. Rata-rata = ' + sum + ' : 6 = ' + correct + ' cm.',
        visual: { type: 'bar', title: 'Tinggi badan', segments: data.map(function (value) { return value + ' cm'; }) }
      });
    }
  ];

  window.JEJAK_TUMBUH_MATH_6 = {
    title: 'Try Out Matematika SD Kelas 6',
    defaultDurationMinutes: 90,
    buildSet: function (count) {
      var indexedGenerators = generators.map(function (generator, index) {
        return { generator: generator, templateIndex: index };
      });
      var picked = shuffle(indexedGenerators).slice(0, Math.min(count, generators.length));
      return picked.map(function (entry, index) {
        var item = entry.generator();
        item.number = index + 1;
        item.templateIndex = entry.templateIndex;
        return item;
      });
    },
    makeVariant: function (item) {
      var generator = generators[item.templateIndex];
      var variant = generator ? generator() : item;
      var tries = 0;
      while (generator && tries < 8 && variant.prompt === item.prompt && variant.correctText === item.correctText) {
        variant = generator();
        tries += 1;
      }
      variant.number = item.number;
      variant.templateIndex = item.templateIndex;
      return variant;
    }
  };
})();
