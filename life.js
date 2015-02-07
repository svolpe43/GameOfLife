
/* The Game of Life */

var boardDimWithoutLines = 600;
var lineWidth = 1;
var running = false;
var lastxcell = -1;
var lastycell = -1;

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
var patterns;

$(document).ready(function(){
	canvas = document.getElementById("discanvas");

	canvas.onmousedown = mouseDown;
	canvas.onmouseup = mouseUp;

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

function pattern(title, pattern){
	this.title = title;
	console.log("dim: " + cellDim);
	this.dim = cellDim;
	this.pattern = pattern.slice();
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
	updateSettingsFromUI();
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

function getPattern(index){
	console.log("Changing pattern...");
	stop();
	updateSettingsFromPattern(patterns[index].dim);
	board = patterns[index].pattern.slice();
	draw();
}

function deletePattern(index){
	patterns[index] = null;
	savePatternCookie();
	resetPatternUI();
}

function save(){
	stop();
	var title = prompt("What do you want to name it?");
	if(title != null){
		patterns[patterns.length] = new pattern(title, board.slice());
		resetPatternUI();
		savePatternCookie();
	}else{
		alert("You have to enter something.");
	}
}

function getDefaultPatterns(){
	patterns[patterns.length] = new pattern('Blinker', createBlinker(DIM).slice());
	patterns[patterns.length] = new pattern('Snow Flake', createSnowflake(DIM).slice());
	patterns[patterns.length] = new pattern('Explosion', createExplosion(DIM).slice());
	savePatternCookie();
	resetPatternUI();
}

/* interal use */

function initBoard(){
	updateSettingsFromUI();
	updateBoardSize();
	getPatterns();
	randomize();
	draw();
}

function updateSettingsFromUI(){
	delta = - Number($("#delta").val());
	cellDim = Number($("#dim").val());
	density = Number($("#density").val());
	updateSettings();
}

function updateSettingsFromPattern(dim){
	
	cellDim = dim;
	updateSettings();
}

function updateSettings(){
	lineWidth = (cellDim < 15) ? 0 : 1;

	DIM = boardDimWithoutLines / cellDim;
	lineOffset = (lineWidth * (DIM - 1));
	boardDimWithLines = boardDimWithoutLines + lineOffset;

	updateBoardSize(DIM);

	canvas.width = canvas.height = boardDimWithLines;
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function updateBoardSize(){
	board = Array.matrix(DIM, DIM, false);
	newBoard = Array.matrix(DIM, DIM, false);
}

function getPatterns(){
	if($.cookie('patterns')){
		patterns = JSON.parse($.cookie('patterns'));
	}else if(localStorage.getItem('patterns')){
		patterns = JSON.parse(localStorage.getItem('patterns'));
	}else{
		patterns = [];
		patterns[0] = new pattern('Blinker', createBlinker(DIM).slice());
		patterns[1] = new pattern('Snow Flake', createSnowflake(DIM).slice());
		patterns[2] = new pattern('Explosion', createExplosion(DIM).slice());
	}
	resetPatternUI();
}

function savePatternCookie(){
	console.log("saving to cookies");
	$.removeCookie('patterns');
	localStorage.removeItem('patterns');
	$.cookie('patterns', JSON.stringify(patterns));
	localStorage.setItem('patterns', JSON.stringify(patterns));
}

function resetPatternUI(){
	$("#patterns").empty();
	for(var i = 0; i < patterns.length; i++){
		if(patterns[i] != null){
			$("#patterns").append(
				'<li><button class="btn" onclick="getPattern(' + i + ')">' + patterns[i].title + '</button>' +
				'<button class="delete-btn" onclick="deletePattern(' + i + ')" style="background: #fff; border: none;">X</button></li>'
			);
		}
	}
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
	board = Array.matrix(DIM, DIM, false);
}

function mouseDown(event){
	console.log("mouse down");

	lastxcell = Math.floor(getCord(event.y, false)/(cellDim + lineWidth));
	lastycell = Math.floor(getCord(event.x, true)/(cellDim + lineWidth));

	console.log(lastxcell + ", " + lastycell);

	board[lastxcell][lastycell] = (board[lastxcell][lastycell]) ? false : true;
	draw();
	
	canvas.onmousemove = mouseMove;
}

function mouseMove(event){
	console.log("mouse move");

	x = Math.floor(getCord(event.y, false)/(cellDim + lineWidth));
	y = Math.floor(getCord(event.x, true)/(cellDim + lineWidth));

	// turn on mouse move when off canvas
	if(x >= DIM || y >= DIM || x < 0 || y < 0){
		canvas.onmousemove = null;
		return;
	}

	if(x != lastxcell || y != lastycell){
		board[x][y] = (board[x][y]) ? false : true;
		lastxcell = x;
		lastycell = y;
		draw();
	}
}

function mouseUp(event){
	console.log("mouse up");
	canvas.onmousemove = null;
}

function getCord(eventN, isX){
	return canvasN = (isX) ? 
		eventN - canvas.offsetLeft + $(document).scrollLeft() :
		eventN - canvas.offsetTop + $(document).scrollTop();
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
