const cols = 8;
const rows = 8;
const pixelSize = 40;

let canvas;
let grid;
let currentColor;
let colorButtons = [];
let undoStack = [];
let redoStack = [];
let drawing = false;

function setup() {
  canvas = createCanvas(cols * pixelSize, rows * pixelSize);
  canvas.parent("canvas-wrapper");
  noSmooth();

  grid = createEmptyGrid();
  currentColor = color(255);

  // Mouse listeners
  canvas.mousePressed(startDrawing);
  canvas.mouseReleased(stopDrawing);

  // Prevent default touch behavior
  canvas.touchStarted(startDrawing);
  canvas.touchEnded(stopDrawing);

  // Initial render
  drawGrid();
}

function draw() {
  if (drawing) {
    drawPixel(mouseX, mouseY);
  }
}

function startDrawing() {
  drawing = true;
  drawPixel(mouseX, mouseY);
}

function stopDrawing() {
  drawing = false;
}

function mouseDragged() {
  if (drawing) drawPixel(mouseX, mouseY);
}

function touchMoved() {
  if (drawing) drawPixel(mouseX, mouseY);
  return false;
}

function drawPixel(x, y) {
  let i = floor(x / pixelSize);
  let j = floor(y / pixelSize);
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    pushUndo();
    grid[i][j] = currentColor;
    drawGrid();
  }
}

function drawGrid() {
  background(0);
  noStroke();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      fill(grid[i][j]);
      rect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
    }
  }
}

function createEmptyGrid() {
  return Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => color(0))
  );
}

// UI Buttons

function setColor(c) {
  currentColor = c;
}

function clearGrid() {
  pushUndo();
  grid = createEmptyGrid();
  drawGrid();
}

function pushUndo() {
  undoStack.push(grid.map(col => col.map(c => c.toString())));
  redoStack = [];
}

function undo() {
  if (undoStack.length > 0) {
    redoStack.push(grid.map(col => col.map(c => c.toString())));
    let prev = undoStack.pop();
    grid = prev.map(col => col.map(cStr => color(cStr)));
    drawGrid();
  }
}

function redo() {
  if (redoStack.length > 0) {
    undoStack.push(grid.map(col => col.map(c => c.toString())));
    let next = redoStack.pop();
    grid = next.map(col => col.map(cStr => color(cStr)));
    drawGrid();
  }
}

function saveCurrentFrameAsPNG() {
  const pg = createGraphics(cols, rows);
  pg.noStroke();
  pg.pixelDensity(1);
  pg.resizeCanvas(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      pg.fill(grid[i][j]);
      pg.rect(i, j, 1, 1);
    }
  }
  save(pg, "draw_to_mint_frame.png");
}
