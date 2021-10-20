const rls = require('readline-sync');
const fs = require('fs');
console.log('', '');

let gameMap = [];
let missiles = 30;
let numbersOfHits = 0;
let countHitShips = 0;

// Read the file and create the matrix with ships positions
const MAP_PATH = "SoftwareDev/ASSIGNMENT_2/Battleship/map_V2.txt";
const MAP_CONTENT = fs.readFileSync(MAP_PATH, "utf-8");

const SPLIT_LINES = MAP_CONTENT.split("\r\n");
let arr_positions = "";
for (let i = 0; i < SPLIT_LINES.length; i++) {
    arr_positions = SPLIT_LINES[i].split(',');
    numbersOfHits += arr_positions.filter(x => x !== '0').length;
    gameMap[i] = arr_positions;
}
// End of the matrix setting

// FANCY HEADER :D
console.log("╭╮     ╭╮        ╭╮        ╭━━╮   ╭╮ ╭╮╭╮      ╭╮     ╭╮" + "\n" +
    "┃┃    ╭╯╰┳╮      ┃┃        ┃╭╮┃  ╭╯╰┳╯╰┫┃      ┃┃     ┃┃" + "\n" +
    "┃┃  ╭━┻╮╭┫┣━━╮╭━━┫┃╭━━┳╮ ╭╮┃╰╯╰┳━┻╮╭┻╮╭┫┃╭━━┳━━┫╰━┳┳━━┫┃" + "\n" +
    "┃┃ ╭┫┃━┫┃╰┫━━┫┃╭╮┃┃┃╭╮┃┃ ┃┃┃╭━╮┃╭╮┃┃ ┃┃┃┃┃┃━┫━━┫╭╮┣┫╭╮┣╯" + "\n" +
    "┃╰━╯┃┃━┫╰╮┣━━┃┃╰╯┃╰┫╭╮┃╰━╯┃┃╰━╯┃╭╮┃╰╮┃╰┫╰┫┃━╋━━┃┃┃┃┃╰╯┣╮" + "\n" +
    "╰━━━┻━━┻━╯╰━━╯┃╭━┻━┻╯╰┻━╮╭╯╰━━━┻╯╰┻━╯╰━┻━┻━━┻━━┻╯╰┻┫╭━┻╯" + "\n" +
    "              ┃┃      ╭━╯┃                         ┃┃" + "\n" +
    "              ╰╯      ╰━━╯                         ╰╯");

console.log("You have", missiles, "missiles to fire to sink all five ships.")

// Generate the map that the user will see and use - the map will count rows from 0 and not from 1 
const HEADER_ARRAY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let viewMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
console.table(viewMap, HEADER_ARRAY);


while (missiles > 0) {
    playGame();
}

// If the user finish all the missiles - GAME OVER
if (countHitShips < numbersOfHits) {
    console.log("You have 0 missiles remaining");
    console.log("GAME OVER.");
    console.log("You had", countHitShips, "of", numbersOfHits, "hits, but didn't sink all the ships");
    console.log("Better luck next time.");
}

////////////////////////////////////////////////        FUNCTIONS AREA      ////////////////////////////////////////////////

function playGame() {
    let position = "";
    let columnPosition = "";
    let rowPosition = "";

    // User input, check and validation
    do {
        position = rls.question("Choose your targer (Ex. A0 to A9): ").toUpperCase();
        columnPosition = position.charAt(0, 1);
        rowPosition = parseInt(position.substr(1));
    }
    while (!isColumnPositionVlaid(columnPosition) || !isRowPositionValid(rowPosition));

    // Once the input is validated it counts as a shot.
    missiles--;

    // Check if the user hit or missed the ship
    checkIfHit(columnPosition, rowPosition);

    // Check if the user hit all the ships
    if (countHitShips == numbersOfHits) {
        console.log("YOU SANK MY ENTIRE FLEET!");
        console.log("You had", countHitShips, "of", numbersOfHits, "hits, whitch sank all ships");
        console.log("You won, congratulations!");
    }
}


function checkIfHit(column, row) {
    if (gameMap[row][HEADER_ARRAY.indexOf(column)] !== '0') {
        // Checki if the user input is the same he already did
        if (gameMap[row][HEADER_ARRAY.indexOf(column)] == 'X') {
            console.log('', '');
            console.log("You have already shot here. Don't waste your missiles.");
            console.log('', '');
        }
        else {
            console.log("YOU HIT SOMETHING!!!!!");
            // Update the map that the player is using to show where he hit.
            viewMap[row][column] = 'X';

            // Check if a ship is sank or not
            isShipSank(column, row);

            console.table(viewMap, HEADER_ARRAY);
            countHitShips++;
        }
        console.log("You have", missiles, "missiles remaining");
    }
    else {
        console.log("Miss");
        console.log("You have", missiles, "missiles remaining");
        viewMap[row][column] = 'O';
        gameMap[row][HEADER_ARRAY.indexOf(column)] = 'X';
        console.table(viewMap, HEADER_ARRAY);
    }
}

function isShipSank(column, row) {
    const shipNameHitted = gameMap[row][HEADER_ARRAY.indexOf(column)];
    let countIfShipSinked = 0;
    for (let n = 0; n < gameMap.length; n++) {
        gameMap[row][HEADER_ARRAY.indexOf(column)] = "X";
        countIfShipSinked += gameMap[n].filter(x => x === shipNameHitted).length;
    }
    if (countIfShipSinked == 0) {
        console.log("You sank a ship!");
    }
}


function isColumnPositionVlaid(column) {
    if (column.match(/[A-J]/i)) {
        return true;
    }
    else {
        console.log("Please enter a valid column position between A and J.");
        return false;
    }
}


function isRowPositionValid(row) {
    if (!isNaN(row)) {
        if ((parseInt(row) >= 0 && parseInt(row) < 10)) {
            return true;
        }
        else {
            console.log("Please enter a valid row position between 0 and 10.");
            return false;
        }
    }
    else {
        console.log("Please enter a valid row position.");
        return false;
    }
}