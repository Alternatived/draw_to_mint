let gridSize = 8;
let pixelSize = 20;
let pixels = [];
let currentColor = '#000000';
let undoStack = [];
let redoStack = [];
let symmetryX = false;
let symmetryY = false;
let showGrid = false;
let isDrawing = false;

let palettes = {
  Teletext: ['#000000', '#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ff00ff', '#00ffff', '#ffffff'],
  Gameboy: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
  CMYK: ['#00FFFF', '#FF00FF', '#FFFF00', '#000000'],
  Mono: ['#000000', '#222222', '#444444', '#666666', '#888888', '#aaaaaa', '#cccccc', '#ffffff']
};

function setup() {
  let canvas = createCanvas(gridSize * pixelSize, gridSize * pixelSize);
  canvas.parent('canvas-container');
  noSmooth();

  for (let y = 0; y < gridSize; y++) {
    pixels[y] = [];
    for (let x = 0; x < gridSize; x++) {
      pixels[y][x] = '#000000';
    }
  }

  updatePaletteUI();
  createUIListeners();
}

function draw() {
  background('#ffffff');

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      fill(pixels[y][x]);
      noStroke();
      rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }

  if (showGrid) {
    stroke(200);
    strokeWeight(1);
    for (let i = 0; i <= gridSize; i++) {
      line(i * pixelSize, 0, i * pixelSize, height);
      line(0, i * pixelSize, width, i * pixelSize);
    }
  }
}

function mousePressed() {
  isDrawing = true;
  drawPixel();
}

function mouseDragged() {
  drawPixel();
}

function mouseReleased() {
  isDrawing = false;
}

function drawPixel() {
  if (!isDrawing || !mouseInCanvas()) return;

  let x = floor(mouseX / pixelSize);
  let y = floor(mouseY / pixelSize);

  if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
    saveUndo();
    setPixel(x, y, currentColor);
  }
}

function setPixel(x, y, color) {
  pixels[y][x] = color;

  if (symmetryX) {
    let sx = gridSize - 1 - x;
    pixels[y][sx] = color;
  }
  if (symmetryY) {
    let sy = gridSize - 1 - y;
    pixels[sy][x] = color;
  }
  if (symmetryX && symmetryY) {
    let sx = gridSize - 1 - x;
    let sy = gridSize - 1 - y;
    pixels[sy][sx] = color;
  }
}

function mouseInCanvas() {
  return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
}

function createUIListeners() {
  document.getElementById('clear').onclick = () => {
    saveUndo();
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        pixels[y][x] = '#000000';
      }
    }
  };

  document.getElementById('fill').onclick = () => {
    saveUndo();
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        pixels[y][x] = currentColor;
      }
    }
  };

  document.getElementById('undo').onclick = () => {
    if (undoStack.length > 0) {
      redoStack.push(JSON.parse(JSON.stringify(pixels)));
      pixels = undoStack.pop();
    }
  };

  document.getElementById('redo').onclick = () => {
    if (redoStack.length > 0) {
      undoStack.push(JSON.parse(JSON.stringify(pixels)));
      pixels = redoStack.pop();
    }
  };

  document.getElementById('symX').onclick = function () {
    symmetryX = !symmetryX;
    this.classList.toggle('active', symmetryX);
  };

  document.getElementById('symY').onclick = function () {
    symmetryY = !symmetryY;
    this.classList.toggle('active', symmetryY);
  };

  document.getElementById('gridToggle').onclick = function () {
    showGrid = !showGrid;
    this.classList.toggle('active', showGrid);
  };

  document.getElementById('palettePicker').onchange = function () {
    updatePaletteUI(this.value);
  };
}

function saveUndo() {
  undoStack.push(JSON.parse(JSON.stringify(pixels)));
  redoStack = [];
}

function updatePaletteUI(paletteName = 'Teletext') {
  let palette = palettes[paletteName];
  let paletteContainer = document.getElementById('palette');
  paletteContainer.innerHTML = '';
  palette.forEach(color => {
    let btn = document.createElement('div');
    btn.className = 'color-button';
    btn.style.backgroundColor = color;
    btn.onclick = () => {
      currentColor = color;
      document.querySelectorAll('.color-button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
    paletteContainer.appendChild(btn);
  });

  // Activate first color
  if (paletteContainer.firstChild) {
    paletteContainer.firstChild.click();
  }
}
