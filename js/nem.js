function Shape(c, s, n) {

	//check if args given, if not set args to =1
	if(typeof(c)==='undefined') c = Math.floor((Math.random() * 4));
	if(typeof(s)==='undefined') s = Math.floor((Math.random() * 4));
	if(typeof(n)==='undefined') n = Math.floor((Math.random() * 4));
	//set initial values
	var color = c;
	var shape = s;
	var number = n;
	//getters
	this.getColor = function() {
		return color;
	}
	this.getShape = function() {
		return shape;
	}
	this.getNumber = function() {
		return number;
	}

	//generate random vals
	this.reroll = function() {
		color = Math.floor((Math.random() * 4));
		shape = Math.floor((Math.random() * 4));
		number = Math.floor((Math.random() * 4));
	}
}


//Globals
var patternElements = [];
var position = 0;
var total_incorrect = 0;
var PATTERN_LENGTH = 4;
var TIME_ALLOWED = 20;
var start_time;
var end_time;
var timer_id;
var game_won = 0;
var TIME_FOR_INCORRECT = 2.5;

function main() {
	var s1 = new Shape();
	var col = s1.getColor();
	var sha = s1.getShape();
	var num = s1.getNumber();
	console.log("color " + col + " shape " + sha + " num " + num);
	for(i = 0; i < PATTERN_LENGTH; i++) {
		var id = "'s" + i + "'";
		s1.reroll();
		col = s1.getColor();
		sha = s1.getShape();
		num = s1.getNumber();
		var shapeClass = '';
		switch(sha) {
			case 0:
				shapeClass = "circle2 ";
				break;
			case 1:
				shapeClass = "triangle2 ";
				break;
			case 2:
				shapeClass = "square2 ";
				break;
			case 3:
				shapeClass = "pentagon2 ";
				break;
		}
		var colorClass = '';
		switch(col) {
			case 0:
				colorClass = "blue ";
				break;
			case 1:
				colorClass = "pink ";
				break;
			case 2:
				colorClass = "yellow ";
				break;
			case 3:
				colorClass = "green ";
				break;
		}
		var numchar = getNumchar(num, 1);
		var classStr = "'shape2 " + colorClass + shapeClass + "'";
		var element = "<div id=" + id + " class=" + classStr + ">" + numchar + "</div>";
		var elementWrapper = "<div id='sw" + i + "' class='wrapper'>" + element + "</div>";
		patternElements.push([col,sha,num]);
		$('.patternDiv').append(elementWrapper);
	}

	console.log(patternElements);
	NProgress.configure({ minimum: 0.0 });
	NProgress.configure({ trickle: false });
	NProgress.configure({ ease: 'ease', speed: 200 });
	NProgress.configure({ parent: '.progressBar' });
	NProgress.set(0.0);

	//return;
	var keyboardType = Math.floor((Math.random() * 3));

	setTimeout(function(){
		generateKeyboard(keyboardType);
		bindClick(keyboardType);
		createTimer(TIME_ALLOWED);
	}, 5000);

}

function getNumchar(num, type) {

	if(typeof(type)==='undefined') type = 0;
	if(type == 0) {
		switch(num) {
			case 0:
				numchar = "A";
				break;
			case 1:
				numchar = "B";
				break;
			case 2:
				numchar = "X";
				break;
			case 3:
				numchar = "Y";
				break;
		}
	}
	else if(type == 1) {
		switch(num) {
			case 0:
				numchar = "\u03C0"; //pi
				break;
			case 1:
				numchar = "\u03B2"; //beta
				break;
			case 2:
				numchar = "\u03A9"; //Omega
				break;
			case 3:
				numchar = "\u03A3"; //Sigma
				break;
		}
	}
	return numchar;

}


function generateKeyboard(type) {
	
	for(i = 0; i < PATTERN_LENGTH; i++) {
		var id = "#s" + i;
		$(id).fadeOut(2000);
	}
	
	switch(type) {
		case 0:
			colorKeyboard();
			break;
		case 1:
			shapeKeyboard();
			break;
		case 2:
			numberKeyboard();
			break;
	}
	//box around first item to guess
	$('#sw0').addClass("currentshape");
}

function shapeKeyboard() {
	var b0 = "<div id='b0' class=" + "'btn pointer shape grey circle2'" + ">" + "</div>";
	var b1 = "<div id='b1' class=" + "'btn pointer shape grey triangle2'" + ">" + "</div>";
	var b2 = "<div id='b2' class=" + "'btn pointer shape grey square2'" + ">" + "</div>";
	var b3 = "<div id='b3' class=" + "'btn pointer shape grey pentagon2'" + ">" + "</div>";
	$(b0).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
	$(b1).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
	$(b2).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
	$(b3).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
}

function colorKeyboard() {
	var b0 = "<div id='b0' class=" + "'pointer shape blue circle'" + ">" + "</div>";
	var b1 = "<div id='b1' class=" + "'pointer shape pink circle'" + ">" + "</div>";
	var b2 = "<div id='b2' class=" + "'pointer shape yellow circle'" + ">" + "</div>";
	var b3 = "<div id='b3' class=" + "'pointer shape green circle'" + ">" + "</div>";
	$(b0).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
	$(b1).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
	$(b2).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
	$(b3).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
}

function numberKeyboard() {
	var b0 = "<div id='b0' class=" + "'pointer shape grey circle'" + ">" + getNumchar(0, 1) + "</div>";
	var b1 = "<div id='b1' class=" + "'pointer shape grey circle'" + ">" + getNumchar(1, 1) + "</div>";
	var b2 = "<div id='b2' class=" + "'pointer shape grey circle'" + ">" + getNumchar(2, 1) + "</div>";
	var b3 = "<div id='b3' class=" + "'pointer shape grey circle'" + ">" + getNumchar(3, 1) + "</div>";
	$(b0).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
	$(b1).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
	$(b2).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
	$(b3).appendTo('.keyboardDiv').hide().delay(2000).fadeIn(500);
}

//determine time till end
function createTimer(allowed) {
	var end = new Date();
	start_time = end;
	end.setSeconds(end.getSeconds() + allowed + 2);
	console.log("Timer ends at " + end); 
	end_time = end;

	timer_id = setInterval(checkTimer, 100);
}

function decrementTimer(amount) {
	var newtime = end_time;
	newtime.setSeconds(newtime.getSeconds() - amount);
	end_time = newtime;
}

function checkTimer() {
	var now = new Date();
	var dif = end_time - now;
	var dif_secs = dif / 1000;
	var pct = (TIME_ALLOWED - dif_secs) / TIME_ALLOWED;
	//Time is up
	if(now >= end_time) {
		NProgress.set(1);
		clearInterval(timer_id);
		gameOver(0);
	}
	//update progress bar
	else {
		NProgress.set(pct + 0.01);
	}
}

//make keyboard clickable after loading keyboard
function bindClick(keyboard) {

	$('#b0').click(function(){
		console.log('Clicked 0!!');
		checkInput(0,keyboard);
	});

	$('#b1').click(function(){
		console.log('Clicked 1!!');
		checkInput(1,keyboard);
	});

	$('#b2').click(function(){
		console.log('Clicked 2!!');
		checkInput(2,keyboard);
	});

	$('#b3').click(function(){
		console.log('Clicked 3!!');
		checkInput(3,keyboard);
	});
	

}

function checkInput(button, keyboard) {
	
	var answer = patternElements[position][keyboard];
	console.log("answer is " + answer + " at position " + position);
	if(button == answer) {
		var id = "#s" + position;
		var wid = "#sw" + position;
		if((position+1) < patternElements.length) {
			$(id).fadeIn(200);
			$(wid).removeClass("currentshape");
			position++;
			wid = "#sw" + position;
			$(wid).addClass("currentshape");
		}
		//you got the last item. you win
		else {
			clearInterval(timer_id);
			$(id).show();
			gameOver(1);
		}
	}
	else {
		total_incorrect++;
		decrementTimer(TIME_FOR_INCORRECT);
		console.log("INCORRECT");
	}
}

function destroyKeyboard(ms) {
	if(typeof(ms)==='undefined') ms = 500;
	$('#b0').fadeOut(ms);
	$('#b1').fadeOut(ms);
	$('#b2').fadeOut(ms);
	$('#b3').fadeOut(ms);

}

function gameOver(win) {

	destroyKeyboard(1000);
	for(i = 0; i < PATTERN_LENGTH; i++) {
		var id = "#sw" + i;
		$(id).fadeOut(1000);
	}
	
	if(win) {
		var msg = "<h3 class='resulttext wintext'>You win. Congratulations!</h3>";
		$(msg).appendTo('.patternDiv').hide().delay(1200).fadeIn(500);
	}
	else {
		var msg = "<h3 class='resulttext losetext'>Congratulations! You lose.</h3>";
		$(msg).appendTo('.patternDiv').hide().delay(1200).fadeIn(500);
	}	

	var retrymsg = "<h3 class='pointer resulttext tryagain'>Try again</h3>";
	$(retrymsg).appendTo('.patternDiv').hide().delay(1200).fadeIn(500);

	$('.tryagain').click(function(){
		window.location.reload()
	});
	
}
