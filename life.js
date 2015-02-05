
/* The Game of Life */

var boardDimWithoutLines = 600;
var lineWidth = 1;
var running = false;

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
	canvas.addEventListener("mousedown", handleClickEvent, false);
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

/* GUI input */

function start(){
	if(!running){
		console.log("Starting...");
		interval = setInterval(step, delta);
		running = true;
	}
}

function stop(){
	if(running){
		console.log("Stopping...");
		clearInterval(interval);
		running = false;
	}
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

function showDelta(val){
	delta = - Number(val);
	console.log(delta);
	stop();
	start();
	$('#deltaval').text(-val + " ms");
}

function showDensity(val){
	density = Number(val);
	$('#densityval').text(val + "%");
}

/* interal use */

function initBoard(){
	updateSettings();
	updateBoardSize();
	randomize();
	draw();
}

function updateBoardSize(){
	board = Array.matrix(DIM, DIM, false);
	newBoard = Array.matrix(DIM, DIM, false);
}

function updateSettings(){
	delta = - Number($("#delta").val());
	cellDim = Number($("#dim").val());
	density = Number($("#density").val());

	lineWidth = (cellDim < 10) ? 0 : 1;

	DIM = boardDimWithoutLines / cellDim;
	lineOffset = (lineWidth * (DIM - 1));
	boardDimWithLines = boardDimWithoutLines + lineOffset;

	updateBoardSize(DIM);

	canvas.width = canvas.height = boardDimWithLines;
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function randomize(){
	clear();
	for(var i = 0; i < DIM; i++){
		for(var j = 0; j < DIM; j++){
			if(Math.random() < density/100)
				board[i][j] = true;
		}
	}
}

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

function handleClickEvent(event)
{
	var xE = event.x - canvas.offsetLeft;
	var yE = event.y - canvas.offsetTop  + $(document).scrollTop();
	
	console.log($(document).scrollTop());

	x = Math.floor(yE/(cellDim + lineWidth));
	y = Math.floor(xE/(cellDim + lineWidth));
	
	board[x][y] = (board[x][y]) ? false : true;
	draw();
}

function step(){
	updateBoard();
	draw();
}

function draw(){
	drawLines();
	drawCells();
}

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

function updateBoard(){
	newBoard = Array.matrix(DIM, DIM, false);
	for(var i = 0; i < DIM; i++){
		for(var j = 0; j < DIM; j++){
			processCell(i, j);
		}
	}
	board = newBoard.slice();
}

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

function isLive(x, y){
	if(x < 0 || y < 0 || x > DIM - 1 || y > DIM - 1)
		return false;
	return board[x][y];
}

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
