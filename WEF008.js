const unitLength = 20;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let frameRateSlider; /* the variable to store the create Slider function with parameter*/
let maxNumLoneliness = 2; /*the default parameter for Loneliness*/
let maxNumOverpopulation = 3; /*the default parameter for Overpopulation*/
let maxNumReproduction = 3; /*the default parameter for Reproduction*/
let myPicker;
let colorIndex;

/*code for the function of multiple color on the same bard which is not yet realise*/
let redColor;
let blueColor;

function setup() {
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth - 100, windowHeight - 200);
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }

  redBlueColorSelector();

  randomPattern();

  defaultPattern();

  colorPicker();

  slider();

  modeSelector();

  startStop();

  stepBystep();

  restart();

  // Now both currentBoard and nextBoard are array of array of undefined values.
  init(); // Set the initial values of the currentBoard and nextBoard
}
/**
 * Initialize/reset the board state
 */
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

function draw() {
  // background(255);

  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        if (nextBoard[i][j] == 1) {
          fill(tinycolor(myPicker.value()).darken(20).toString());
        } else {
          fill(myPicker.value());
        }
      } else if (
        currentBoard[i][j] == 1 &&
        currentBoard[i][j][colorIndex] == 2
      ) {
        fill("red");
      } else if (
        currentBoard[i][j] == 1 &&
        currentBoard[i][j][colorIndex] == 3
      ) {
        fill("blue");
      } else {
        fill(255, [0.5]);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
  //use the slider as a frame rate value with title//
  let frameRateValue = frameRateSlider.value();
  frameRate(frameRateValue);
}

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < maxNumLoneliness) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > maxNumOverpopulation) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == maxNumReproduction) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }
  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}
/**
 * When mouse is dragged
 */
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);

  currentBoard[x][y] = 1;
  if (colorIndex == 1) {
    currentBoard[x][y][colorIndex] = 2;
    fill("red");
  } else if (colorIndex == 2) {
    currentBoard[x][y][colorIndex] = 3;
    fill("blue");
  } else {
    fill(myPicker.value());
  }
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

function slider() {
  frameRateSlider = createSlider(0, 60, 25);
  frameRateSlider.parent("sliderContainer");
}

function modeSelector() {
  let originalRuleOfSurvialButton = createButton("OriginalRule");
  originalRuleOfSurvialButton.mousePressed(() => {
    maxNumLoneliness = 2;
    maxNumOverpopulation = 3;
    maxNumReproduction = 3;
    console.log("mode0");
  });
  originalRuleOfSurvialButton.parent("modeSelectorContainer");

  let changeRuleOfSurvialButton = createButton("Change Survival Rule");
  changeRuleOfSurvialButton.mousePressed(() => {
    maxNumLoneliness = 3;
    maxNumOverpopulation = 3;
    maxNumReproduction = 3;
    console.log("mode1");
  });
  changeRuleOfSurvialButton.parent("modeSelectorContainer");

  let changeRuleOfReproductionButton = createButton("Change Reproduction Rule");
  changeRuleOfReproductionButton.mousePressed(() => {
    maxNumLoneliness = 2;
    maxNumOverpopulation = 3;
    maxNumReproduction = 1;
    console.log("mode2");
  });
  changeRuleOfReproductionButton.parent("modeSelectorContainer");
}

function startStop() {
  let startButton;
  noLoop();
  startButton = createButton("Start");
  startButton.id("start");
  startButton.parent("#startStopContainer");
  StopButton = createButton("Stop");
  StopButton.parent("#startStopContainer");
  StopButton.id("stop");

  startButton.mousePressed(start);

  StopButton.mousePressed(stop);

  function start() {
    loop();
  }

  function stop() {
    noLoop();
  }
}

function stepBystep() {
  let steptBySteptButton = createButton("Step");

  steptBySteptButton.parent("startStopContainer");

  steptBySteptButton.mousePressed(() => draw());
}

function restart() {
  let restartButton = createButton("Restart");

  restartButton.parent("startStopContainer");

  restartButton.id("restart");

  restartButton.mousePressed(reset);

  function reset() {
    init();
    draw();
    noLoop();
  }
}

function colorPicker() {
  myPicker = createColorPicker("pink");
  myPicker.id("colorPicker");

  myPicker.parent("colorPickerContainer");
}

function windowResized() {
  resizeCanvas(windowWidth - 100, windowHeight - 200);
}

function randomPattern() {
  let randomPatternButton = createButton("Random Pattern");

  randomPatternButton.parent("Pattern");

  randomPatternButton.mousePressed(randomNumArray);

  function randomNumArray() {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        currentBoard[i][j] = random() > 0.8 ? 1 : 0;
        nextBoard[i][j] = 0;
      }
    }
    loop();
    noLoop();
  }
}

function defaultPattern() {
  let defaultPatternButton = createButton(`"Quasar" Pattern`);

  defaultPatternButton.parent("Pattern");

  defaultPatternButton.mousePressed(defaultPatternGenerator);

  function defaultPatternGenerator() {
    function transfromStringtoArray() {
      const Quasar = `..........OOO...OOO

........O....O.O....O
........O....O.O....O
........O....O.O....O
..........OOO...OOO

........OOO.......OOO
..OOO..O....O...O....O..OOO
.......O....O...O....O
O....O.O....O...O....O.O....O
O....O.................O....O
O....O..OOO.......OOO..O....O
..OOO...................OOO

..OOO...................OOO
O....O..OOO.......OOO..O....O
O....O.................O....O
O....O.O....O...O....O.O....O
.......O....O...O....O
..OOO..O....O...O....O..OOO
........OOO.......OOO

..........OOO...OOO
........O....O.O....O
........O....O.O....O
........O....O.O....O

..........OOO...OOO`;

      let patternTransform = Quasar.replace(/\./g, "0");
      patternTransform = patternTransform.replace(/O/g, "1");

      console.log(patternTransform);

      let stringsGroup = patternTransform.split("\n");
      // console.log(stringsGroup)
      let outterArray = [];
      for (i = 0; i < stringsGroup.length; i++) {
        // console.log(stringsGroup[i])
        let chars = stringsGroup[i].split("");
        let innerArray = [];
        for (j = 0; j < chars.length; j++) {
          innerArray.push(parseInt(chars[j]));
        }
        console.log(innerArray);
        outterArray.push(innerArray);
      }
      console.log(outterArray);

      return outterArray;
    }

    const pattern = transfromStringtoArray();

    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
        currentBoard[30 + i][3 + j] = pattern[i][j];
        nextBoard[i][j] = 0;
      }
    }
    loop();
    noLoop();
  }
}

function redBlueColorSelector() {
  let button1 = createButton("redColor");
  button1.mousePressed(function redColorSelected() {
    colorIndex = 1;
  });

  let button2 = createButton("blueColor");
  button2.mousePressed(function blueColorSelected() {
    colorIndex = 2;
  });
}
