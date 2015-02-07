
/* Making patterns */

function createBlinker(){
	var pattern = Array.matrix(DIM, DIM, false);

	var centerX = DIM/2;
	var centerY = DIM/2;

	for(var i = centerY; i < centerY + 3; i++){
		pattern[centerX - 5][i - 5] = true;
	}
	for(var i = centerY; i < centerY + 3; i++){
		pattern[centerX - 5][i + 5] = true;
	}
	for(var i = centerY; i < centerY + 3; i++){
		pattern[centerX + 5][i - 5] = true;
	}
	for(var i = centerY; i < centerY + 3; i++){
		pattern[centerX + 5][i + 5] = true;
	}
	return pattern;
}

function createExplosion(){
	var pattern = Array.matrix(DIM, DIM, false);

	var centerX = DIM/2;
	var centerY = DIM/2;

	pattern[centerX][centerY] = true;
	pattern[centerX + 3][centerY] = true;

	for(var i = centerY + 1; i < centerY + 1 + 2; i++){
		pattern[i][centerX - 1] = true;
	}
	for(var i = centerY; i < centerY + 1 + 2; i++){
		pattern[i][centerX + 1] = true;
	}

	return pattern;
}

function createSnowflake(){
	var pattern = Array.matrix(DIM, DIM, false);

	var centerX = DIM/2;
	var centerY = DIM/2;

	var lineLength = 3;

	var xoffset = 6;
	var yoffset = 3;

	// 4 horizontal outside lines
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[centerX - xoffset][i - 4] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[centerX - xoffset][i + 2] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[centerX + xoffset][i - 4] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[centerX + xoffset][i + 2] = true;
	}

	xoffset = 6;
	yoffset = 4;

	// 4 vertical outside lines
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[i - 4][centerX - xoffset] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[i + 2][centerX - xoffset] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[i - 4][centerX + xoffset] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[i + 2][centerX + xoffset] = true;
	}

	xoffset = 1;
	yoffset = 3;

	// 4 horizontal inside lines
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[centerX - xoffset][i - 4] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[centerX - xoffset][i + 2] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[centerX + xoffset][i - 4] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[centerX + xoffset][i + 2] = true;
	}

	// 4 vertical outside lines
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[i - 4][centerX - xoffset] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[i + 2][centerX - xoffset] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[i - 4][centerX + xoffset] = true;
	}
	for(var i = centerY; i < centerY + lineLength; i++){
		pattern[i + 2][centerX + xoffset] = true;
	}

	return pattern;
}
