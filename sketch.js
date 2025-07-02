let pixelSize;
const cols = 8, rows = 8;
let canvas;

const palettes = {
  Retro: [
    '#000000',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#ffffff'
  ]
};

let currentPalette = palettes.Retro;
let currentColor = currentPalette[7]; // white by default

let grid;
let history = [];
let historyIndex = -1;
let drawing = false;

function setup() {
  const canvasSize = 320;
  pixelSize = canvasSize / cols;
  canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('canvas-container');
  noSmooth();
  initGrid();
  createPaletteUI();
  bindButtons();

  canvas.mousePressed(() => { drawing = true; drawPixel(mouseX, mouseY); });
  canvas.mouseReleased(() => drawing = false);
  canvas.touchStarted(() => { drawing = true; drawPixel(mouseX, mouseY); return false; });
  canvas.touchEnded(() => { drawing = false; return false; });

  noLoop();
  redraw();
}

function draw() {
  background('#ffffff');
  drawGrid();
}

function initGrid() {
  grid = Array(cols).fill().map(() => Array(rows).fill(currentPalette[0]));
  saveHistory();
}

function drawGrid() {
  noStroke();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      fill(grid[i][j]);
      rect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
    }
  }
}

function drawPixel(x, y) {
  let i = floor(x / pixelSize);
  let j = floor(y / pixelSize);
  if (i < 0 || i >= cols || j < 0 || j >= rows) return;

  if (grid[i][j] !== currentColor) {
    grid[i][j] = currentColor;
    saveHistory();
    redraw();
  }
}

function createPaletteUI() {
  const paletteContainer = document.getElementById('palette');
  currentPalette.forEach(color => {
    const btn = document.createElement('div');
    btn.className = 'colorButton';
    btn.style.backgroundColor = color;
    btn.addEventListener('click', () => {
      currentColor = color;
      updatePaletteUI();
    });
    paletteContainer.appendChild(btn);
  });
  updatePaletteUI();
}

function updatePaletteUI() {
  const buttons = document.querySelectorAll('.colorButton');
  buttons.forEach(btn => {
    if (btn.style.backgroundColor === currentColor) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function bindButtons() {
  document.getElementById('clear').addEventListener('click', () => {
    initGrid();
    redraw();
  });

  document.getElementById('undo').addEventListener('click', () => {
    undo();
  });

  document.getElementById('redo').addEventListener('click', () => {
    redo();
  });
}

function saveHistory() {
  // Save a deep copy of the grid
  history = history.slice(0, historyIndex + 1);
  history.push(grid.map(col => col.slice()));
  historyIndex++;
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    grid = history[historyIndex].map(col => col.slice());
    redraw();
  }
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    grid = history[historyIndex].map(col => col.slice());
    redraw();
  }
}

// Function to export current canvas as PNG data URL
function exportPNGDataURL() {
  return canvas.elt.toDataURL('image/png');
}
