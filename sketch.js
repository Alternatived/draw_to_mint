let cols = 8;
let rows = 8;
let grid = [];
let pixelSize;
let currentColor = [0, 0, 0];
let drawing = false;

let palette = [
  [0, 0, 0],
  [255, 0, 0],
  [0, 255, 0],
  [0, 0, 255],
  [255, 255, 0],
  [255, 0, 255],
  [0, 255, 255],
  [255, 255, 255],
];

let history = [];
let redoStack = [];

function setup() {
  let canvasSize = 400;
  pixelSize = canvasSize / cols;
  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent("canvas-container");
  noStroke();
  initGrid();
  drawPalette();
}

function draw() {
  background(220);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      fill(grid[i][j]);
      rect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
    }
  }

  if (drawing && mouseIsPressed) drawPixel(mouseX, mouseY);
}

function initGrid() {
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [255, 255, 255];
    }
  }
}

function drawPixel(x, y) {
  let i = floor(x / pixelSize);
  let j = floor(y / pixelSize);
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    pushHistory();
    grid[i][j] = currentColor.slice();
  }
}

function drawPalette() {
  let paletteDiv = document.getElementById("palette");
  paletteDiv.innerHTML = "";
  palette.forEach((color, index) => {
    let btn = document.createElement("button");
    btn.style.backgroundColor = `rgb(${color})`;
    btn.className = "color-button";
    btn.onclick = () => {
      currentColor = color;
    };
    paletteDiv.appendChild(btn);
  });
}

function mousePressed() {
  drawing = true;
  drawPixel(mouseX, mouseY);
}

function mouseReleased() {
  drawing = false;
}

function pushHistory() {
  let copy = grid.map(col => col.map(px => [...px]));
  history.push(copy);
  redoStack = [];
}

function undo() {
  if (history.length > 0) {
    redoStack.push(grid.map(col => col.map(px => [...px])));
    grid = history.pop();
  }
}

function redo() {
  if (redoStack.length > 0) {
    history.push(grid.map(col => col.map(px => [...px])));
    grid = redoStack.pop();
  }
}

function clearGrid() {
  pushHistory();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [255, 255, 255];
    }
  }
}

function mintFrame() {
  const data = grid.flat().map(c => c.join(",")).join(";");
  alert("Minting frame: " + data);
}
