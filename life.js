
/* The Game of Life */

var boardDimWithoutLines = 600;
var lineWidth = 1;

var canvas;
var context;
var board;
var newBoard;
var interval;
var delta;
var cellDim;
var DIM;
var lineOffset;
var boardDimWithLines;
var density;

$(document).ready(function(){
	canvas = document.getElementById("discanvas");
	canvas.addEventListener("mousedown", getPosition, false);
	context = canvas.getContext("2d");
	context.lineWidth = lineWidth;
	initBoard();
});

Array.matrix = function(numrows, numcols, initial){
   var arr = [];
   for (var i = 0; i < numrows; ++i){
      var columns = [];
      for (var j = 0; j < numcols; ++j){
         columns[j] = initial;
      }
      arr[i] = columns;
    }
    return arr;
}

/* user input functions */

function start(){
	console.log("Starting...");
	interval = setInterval(step, delta);
}

function stop(){
	console.log("Stopping...");
	clearTimeout(interval);
}

function resume(){
	console.log("Resuming...");
	interval = setInterval(step, delta);
}

function setRandom(){
	stop();
	randomize();
	draw();
}

function update(){
	stop();
	updateSettings();
	randomize();
	draw();
}

function reset(){
	stop();
	clear();
	draw();
}

// init the board
function initBoard(){
	stop();
	updateSettings();

	board = Array.matrix(DIM, DIM, false);
	newBoard = Array.matrix(DIM, DIM, false);
	randomize();
	
	draw();
}

// get settings from html
function updateSettings(){
	delta = Number($("#delta").val());
	cellDim = Number($("#dim").val());
	density = Number($("#density").val());

	DIM = boardDimWithoutLines / cellDim;
	lineOffset = (lineWidth * (DIM - 1));
	boardDimWithLines = boardDimWithoutLines + lineOffset;

	canvas.width = canvas.height = boardDimWithLines;
	context.clearRect(0, 0, canvas.width, canvas.height);
}

// callback to run every second
function step(){
	updateBoard();
	draw();
}

// randomize the board
function randomize(){
	clear();
	for(var i = 0; i < DIM; i++){
		for(var j = 0; j < DIM; j++){
			if(Math.random() < density/100)
				board[i][j] = true;
		}
	}
}

// clear the board
function clear(){
	for(var i = 0; i < DIM; i++){
		for(var j = 0; j < DIM; j++){
			board[i][j] = false;
		}
	}
}

//TODO mouse drag over canvas
function startMoveListener(event){
	console.log("start");
	canvas.addEventListener("onmousemove", getPosition, false);
}
function endMoveListener(event){
	console.log("stop");
	canvas.removeEventListener("onmousemove", getPosition, false);
}

// grabs the cordinates of the mouse click
function getPosition(event)
{
	var xE = event.x - canvas.offsetLeft;;
	var yE = event.y - canvas.offsetTop;

	x = Math.floor(yE/(cellDim + lineWidth));
	y = Math.floor(xE/(cellDim + lineWidth));
	
	board[x][y] = (board[x][y]) ? false : true;
	draw();
}

// slider value viewer
function showDelta(val){
	$('#deltaval').text(val + " ms");
}

// slider value viewer
function showDensity(val){
	$('#densityval').text(val + "%");
}

function draw(){
	drawLines();
	drawCells();
}

// draw all of the cell lines
function drawLines(){
	context.fillStyle="#000000";
	var offset = cellDim + lineWidth;
	var x = 0;
	var y = cellDim + lineWidth/2;

	context.beginPath();

	// horizontal lines - y incrementing x is the same
	for(var i = 0; i < DIM - 1; i++){
		context.moveTo(x, y);
		context.lineTo(x + boardDimWithLines, y);
		context.stroke();
		y += offset;
	}

	x = cellDim + lineWidth/2;;
	y = 0;

	// vertical lines - x incrementing y is the same
	for(var i = 0; i < DIM - 1; i++){
		context.moveTo(x, y);
		context.lineTo(x, y + boardDimWithLines);
		context.stroke();
		x += offset;
	}
}

// draw all of the cells
// ctx.fillRect(x, y, height, width);
function drawCells(){
	context.fillStyle="#9966ff";
	var offset = cellDim + lineWidth;
	var x = 0;
	var y = 0;
	for(var i = 0; i < DIM; i++){
		for(var j = 0; j < DIM; j++){
			if(board[i][j])
				context.fillRect(x, y, cellDim, cellDim);
			else
				context.clearRect(x, y, cellDim, cellDim);
			x += offset;
		}
		y += offset;
		x = 0;
	}
}

// update the board
function updateBoard(){

	newBoard = Array.matrix(DIM, DIM, false);

	for(var i = 0; i < DIM; i++){
		for(var j = 0; j < DIM; j++){
			processCell(i, j);
		}
	}
	board = newBoard.slice();
}

// used to copy the updated board into the board
function copyBoard(copythis, intothis){
	for(var i = 0; i < DIM; i++){
		for(var j = 0; j < DIM; j++){
			intothis[i][j] = copythis[i][j];
		}
	}
}

// process life information about current cell
function processCell(x, y){
	var count = 0;
	for(var i = -1; i < 2; i++){
		for(var j = -1; j < 2; j++){
			if(i == 0 && j == 0)
				continue;
			if(isLive(x + i, y + j))
				count++;
		}
	}
	updateCell(count, x, y);
}

// update cell based on information found
function updateCell(count, x, y){
	if(board[x][y]){
		if (count == 2 || count == 3)
		    newBoard[x][y] = true;
		else
		    newBoard[x][y] = false;
	}else{
		if(count == 3)
			newBoard[x][y] = true;
		else{
			newBoard[x][y] = false;
		}
	}
}

// use the old board to make them all happen simultaneously
function isLive(x, y){
	if(x < 0 || y < 0 || x > DIM - 1 || y > DIM - 1)
		return false;
	return board[x][y];
}
