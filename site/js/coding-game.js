(function () {
  'use strict';

  var app = document.querySelector('[data-coding-game]');
  if (!app) return;

  var width = 12;
  var height = 7;
  var tileNames = {
    sky: 'Langit',
    grass: 'Tanah',
    platform: 'Pijakan',
    coin: 'Koin',
    start: 'Start',
    goal: 'Bendera'
  };
  var deltas = {
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0]
  };
  var keyMap = {
    ArrowUp: 'up',
    ArrowRight: 'right',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    w: 'up',
    d: 'right',
    s: 'down',
    a: 'left'
  };

  var boardEl = app.querySelector('[data-game-board]');
  var paletteEl = app.querySelector('[data-tile-palette]');
  var modeLabel = app.querySelector('[data-mode-label]');
  var gameStatus = app.querySelector('[data-game-status]');
  var gameLog = app.querySelector('[data-game-log]');
  var moveButtons = app.querySelectorAll('[data-move]');

  var defaultRows = [
    '............',
    '............',
    '..pp..c..p..',
    '.sppppppppf.',
    '..p...p..p..',
    '..ggggggggg.',
    'gggggggggggg'
  ];

  var state = {
    mode: 'edit',
    tool: 'grass',
    map: rowsToMap(defaultRows),
    player: 0,
    collected: {},
    lives: 3,
    won: false,
    obstacle: {
      x: 7,
      y: 3,
      home: index(7, 3),
      direction: -1
    },
    obstacleTimer: null
  };

  function rowsToMap(rows) {
    return rows.join('').split('').map(function (char) {
      return { '.': 'sky', g: 'grass', p: 'platform', c: 'coin', s: 'start', f: 'goal' }[char] || 'sky';
    });
  }

  function index(x, y) {
    return y * width + x;
  }

  function coords(cellIndex) {
    return { x: cellIndex % width, y: Math.floor(cellIndex / width) };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function findTile(tile) {
    var found = state.map.indexOf(tile);
    return found >= 0 ? found : 0;
  }

  function coinIndexes() {
    return state.map.map(function (tile, tileIndex) {
      return tile === 'coin' ? tileIndex : -1;
    }).filter(function (tileIndex) {
      return tileIndex >= 0;
    });
  }

  function collectedCount() {
    return coinIndexes().filter(function (tileIndex) {
      return Boolean(state.collected[tileIndex]);
    }).length;
  }

  function totalCoins() {
    return coinIndexes().length;
  }

  function setLog(message) {
    gameLog.textContent = message;
  }

  function isWalkable(tile) {
    return tile === 'grass' || tile === 'platform' || tile === 'coin' || tile === 'start' || tile === 'goal';
  }

  function ensureSpecialTiles() {
    if (state.map.indexOf('start') === -1) state.map[index(1, height - 2)] = 'start';
    if (state.map.indexOf('goal') === -1) state.map[index(width - 2, height - 2)] = 'goal';
  }

  function resetObstacle() {
    var home = coords(state.obstacle.home);
    state.obstacle.x = home.x;
    state.obstacle.y = clamp(home.y, 1, height - 2);
    state.obstacle.direction = -1;
  }

  function obstacleIndex() {
    return index(state.obstacle.x, state.obstacle.y);
  }

  function resetRun() {
    ensureSpecialTiles();
    state.player = findTile('start');
    state.collected = {};
    state.lives = 3;
    state.won = false;
    resetObstacle();
  }

  function stopObstacle() {
    if (state.obstacleTimer) {
      window.clearInterval(state.obstacleTimer);
      state.obstacleTimer = null;
    }
  }

  function startObstacle() {
    stopObstacle();
    state.obstacleTimer = window.setInterval(function () {
      if (state.mode !== 'play' || state.won || state.lives <= 0) return;
      var nextY = state.obstacle.y + state.obstacle.direction;
      if (nextY < 1 || nextY > height - 2) {
        state.obstacle.direction *= -1;
        nextY = state.obstacle.y + state.obstacle.direction;
      }
      state.obstacle.y = nextY;
      if (obstacleIndex() === state.player) {
        hitObstacle('Panah bergerak mengenai Piko.');
      } else {
        render();
      }
    }, 720);
  }

  function hitObstacle(message) {
    state.lives -= 1;
    if (state.lives <= 0) {
      state.lives = 0;
      stopObstacle();
      setLog(message + ' Nyawa habis. Tekan Mainkan untuk mencoba lagi.');
    } else {
      state.player = findTile('start');
      resetObstacle();
      setLog(message + ' Piko kembali ke start. Amati irama panah, lalu coba lagi.');
    }
    render();
  }

  function placeObstacle(tileIndex) {
    var tile = state.map[tileIndex];
    if (tile === 'start' || tile === 'goal') {
      setLog('Panah jangan ditaruh di start atau bendera. Pilih petak lain.');
      return;
    }
    var cell = coords(tileIndex);
    state.obstacle.x = cell.x;
    state.obstacle.y = clamp(cell.y, 1, height - 2);
    state.obstacle.home = index(state.obstacle.x, state.obstacle.y);
    state.obstacle.direction = -1;
    setLog('Panah dipindahkan. Saat dimainkan, panah bergerak naik-turun.');
    render();
  }

  function paint(tileIndex) {
    if (state.mode !== 'edit') return;
    if (state.tool === 'arrow') {
      placeObstacle(tileIndex);
      return;
    }
    if (state.tool === 'start' || state.tool === 'goal') {
      state.map = state.map.map(function (tile) {
        return tile === state.tool ? 'sky' : tile;
      });
    }
    state.map[tileIndex] = state.tool;
    ensureSpecialTiles();
    state.collected = {};
    state.won = false;
    state.lives = 3;
    state.player = findTile('start');
    render();
  }

  function setMode(mode) {
    state.mode = mode;
    modeLabel.textContent = mode === 'edit' ? 'Mode edit' : 'Mode main';
    if (mode === 'play') {
      resetRun();
      setLog('Piko mulai berjalan. Sampai ke bendera dan hindari panah.');
      startObstacle();
    } else {
      stopObstacle();
      resetObstacle();
      setLog('Mode edit aktif. Pilih tile, lalu klik petak level.');
    }
    render();
  }

  function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < width && y < height;
  }

  function move(direction) {
    if (state.mode !== 'play' || state.won || state.lives <= 0) return false;
    var delta = deltas[direction];
    var current = coords(state.player);
    var nextX = current.x + delta[0];
    var nextY = current.y + delta[1];
    if (!inBounds(nextX, nextY)) {
      setLog('Piko sudah di tepi level. Coba arah lain.');
      return false;
    }

    var nextIndex = index(nextX, nextY);
    var tile = state.map[nextIndex];
    if (!isWalkable(tile)) {
      setLog('Belum ada pijakan di sana. Kembali ke edit level untuk menambah tanah atau pijakan.');
      return false;
    }
    if (nextIndex === obstacleIndex()) {
      hitObstacle('Piko masuk jalur panah.');
      return false;
    }

    state.player = nextIndex;
    if (tile === 'coin' && !state.collected[nextIndex]) {
      state.collected[nextIndex] = true;
      setLog('Koin berhasil diambil. Lanjutkan ke bendera.');
    } else {
      setLog('Piko maju satu langkah.');
    }

    if (tile === 'goal') {
      state.won = true;
      stopObstacle();
      setLog('Berhasil. Piko sampai ke bendera. Sekarang coba edit level supaya lebih seru.');
    }

    render();
    return true;
  }

  function renderStatus() {
    var coinTotal = totalCoins();
    gameStatus.innerHTML =
      '<span>Koin</span>' +
      '<strong>' + collectedCount() + '/' + coinTotal + '</strong>' +
      '<small>Nyawa ' + state.lives + '</small>';
  }

  function tileLabel(tile, tileIndex) {
    if (state.mode === 'play' && state.player === tileIndex) {
      return '<b class="player-token">P</b>';
    }
    if (tileIndex === obstacleIndex()) {
      return '<span class="arrow-hazard"></span>';
    }
    if (tile === 'start') return '<span>S</span>';
    if (tile === 'goal') return '<span>B</span>';
    if (tile === 'coin' && !state.collected[tileIndex]) return '<span class="coin-dot"></span>';
    return '';
  }

  function render() {
    boardEl.innerHTML = '';
    boardEl.classList.toggle('is-playing', state.mode === 'play');
    boardEl.style.setProperty('--cols', width);

    state.map.forEach(function (tile, tileIndex) {
      var cell = coords(tileIndex);
      var button = document.createElement('button');
      var label = tileNames[tile] || 'Petak';
      var hasArrow = tileIndex === obstacleIndex();
      button.type = 'button';
      button.className = 'game-tile game-tile--' + tile;
      if (hasArrow) button.classList.add('has-arrow');
      if (cell.x === state.obstacle.x && cell.y >= 1 && cell.y <= height - 2) button.classList.add('is-arrow-lane');
      button.setAttribute('aria-label', label + ' baris ' + (cell.y + 1) + ' kolom ' + (cell.x + 1) + (hasArrow ? ', ada panah bergerak' : ''));
      button.innerHTML = tileLabel(tile, tileIndex);
      if (state.mode === 'play') button.disabled = true;
      button.addEventListener('click', function () { paint(tileIndex); });
      boardEl.appendChild(button);
    });

    renderStatus();
    moveButtons.forEach(function (button) {
      button.disabled = state.mode !== 'play' || state.won || state.lives <= 0;
    });
  }

  function loadPreset() {
    state.map = rowsToMap(defaultRows);
    state.obstacle.home = index(7, 3);
    resetRun();
    setLog('Level contoh dimuat. Tekan Mainkan untuk mencoba.');
    render();
  }

  function clearMap() {
    var x;
    var pathX;
    state.map = Array(width * height).fill('sky');
    for (x = 0; x < width; x += 1) {
      state.map[index(x, height - 1)] = 'grass';
    }
    for (pathX = 1; pathX < width - 1; pathX += 1) {
      state.map[index(pathX, height - 2)] = 'platform';
    }
    state.map[index(1, height - 2)] = 'start';
    state.map[index(width - 2, height - 2)] = 'goal';
    state.obstacle.home = index(Math.floor(width / 2), height - 3);
    resetRun();
    setLog('Level dikosongkan dengan satu jalur dasar. Tambahkan koin dan panah.');
    render();
  }

  paletteEl.addEventListener('click', function (event) {
    var button = event.target.closest('[data-tool]');
    if (!button) return;
    state.tool = button.dataset.tool;
    paletteEl.querySelectorAll('[data-tool]').forEach(function (item) {
      item.classList.toggle('is-active', item === button);
    });
  });

  app.querySelector('[data-preset-map]').addEventListener('click', loadPreset);
  app.querySelector('[data-clear-map]').addEventListener('click', clearMap);
  app.querySelector('[data-edit-mode]').addEventListener('click', function () { setMode('edit'); });
  app.querySelector('[data-play-mode]').addEventListener('click', function () { setMode('play'); });

  app.querySelectorAll('[data-move]').forEach(function (button) {
    button.addEventListener('click', function () {
      move(button.dataset.move);
    });
  });

  document.addEventListener('keydown', function (event) {
    var direction = keyMap[event.key];
    if (!direction || state.mode !== 'play') return;
    event.preventDefault();
    move(direction);
  });

  resetRun();
  setLog('Pilih tile, bangun level, lalu tekan Mainkan.');
  render();
})();
