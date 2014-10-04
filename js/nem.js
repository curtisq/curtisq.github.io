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
var PATTERN_LENGTH = 1;
var TIME_ALLOWED = 5;
var VIEW_TIME = 3000;
var position = 0;
var total_incorrect = 0;
var start_time;
var end_time;
var timer_id;
var game_won = 0;
var TIME_FOR_INCORRECT = 2.5;
var time_remaining;
var time_under_total = 0;

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
	}, VIEW_TIME);

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
		$(id).delay(250 * i).fadeOut(500);
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
	var keyboard_delay = 250 * PATTERN_LENGTH;

	var b0 = "<div id='b0' class=" + "'btn pointer shape grey circle2'" + ">" + "</div>";
	var b1 = "<div id='b1' class=" + "'btn pointer shape grey triangle2'" + ">" + "</div>";
	var b2 = "<div id='b2' class=" + "'btn pointer shape grey square2'" + ">" + "</div>";
	var b3 = "<div id='b3' class=" + "'btn pointer shape grey pentagon2'" + ">" + "</div>";
	$(b0).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b1).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b2).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b3).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
}

function colorKeyboard() {
	var keyboard_delay = 250 * PATTERN_LENGTH;

	var b0 = "<div id='b0' class=" + "'pointer shape blue circle'" + ">" + "</div>";
	var b1 = "<div id='b1' class=" + "'pointer shape pink circle'" + ">" + "</div>";
	var b2 = "<div id='b2' class=" + "'pointer shape yellow circle'" + ">" + "</div>";
	var b3 = "<div id='b3' class=" + "'pointer shape green circle'" + ">" + "</div>";
	$(b0).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b1).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b2).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b3).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);

}

function numberKeyboard() {
	var keyboard_delay = 250 * PATTERN_LENGTH;

	var b0 = "<div id='b0' class=" + "'pointer shape grey circle'" + ">" + getNumchar(0, 1) + "</div>";
	var b1 = "<div id='b1' class=" + "'pointer shape grey circle'" + ">" + getNumchar(1, 1) + "</div>";
	var b2 = "<div id='b2' class=" + "'pointer shape grey circle'" + ">" + getNumchar(2, 1) + "</div>";
	var b3 = "<div id='b3' class=" + "'pointer shape grey circle'" + ">" + getNumchar(3, 1) + "</div>";
	$(b0).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b1).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b2).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b3).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);

}

//determine time till end
function createTimer(allowed) {
	var keyboard_delay = 0.25 * PATTERN_LENGTH + 0.3;
	var end = new Date();
	start_time = new Date();
	end.setSeconds(end.getSeconds() + allowed + keyboard_delay);
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
	time_remaining = dif_secs;
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
			console.log("WIN WITH " + time_remaining + "s REMAINING");
			time_under_total += (time_remaining);
			console.log("TOTAL TIME UNDER TARGET- " + time_under_total + "s");
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
	$('#b0').fadeOut(ms).remove();
	$('#b1').fadeOut(ms).remove();
	$('#b2').fadeOut(ms).remove();
	$('#b3').fadeOut(ms).remove();

}

function gameOver(win) {

	destroyKeyboard(1000);
	for(i = 0; i < PATTERN_LENGTH; i++) {
		var id = "#sw" + i;
		$(id).fadeOut(1000);
	}

	$('#levelscore').text("-" + time_under_total + " seconds total");

	if(win) {
		var msg = "<h3 class='resulttext wintext'>You won with " + Math.round(time_remaining) + " of " + TIME_ALLOWED + "<br>seconds remaining." + "</h3>";
		$(msg).appendTo('.patternDiv').hide().delay(1000).fadeIn(500);
		//continue
		var contmsg = "<h3 class='pointer resulttext continue'>Continue</h3>";
		$(contmsg).appendTo('.patternDiv').hide().delay(1000).slideToggle(300);

		$('.continue').click(function(){
			refreshBoard();
			patternElements = [];
			PATTERN_LENGTH++;
			TIME_ALLOWED += 2.5;
			VIEW_TIME += 1000;
			position = 0;
			main();
		});

	}
	else {
		var msg = "<h3 class='resulttext losetext'>Sorry, you forgot.<br>Final Score: -" + time_under_total + "s</h3>";
		$(msg).appendTo('.patternDiv').hide().delay(1200).fadeIn(500);
	}	

	var retrymsg = "<h3 class='pointer resulttext tryagain'>Start Over</h3>";
	$(retrymsg).appendTo('.patternDiv').hide().delay(1200).fadeIn(500);

	$('.tryagain').click(function(){
		window.location.reload();
	});
	
}

function refreshBoard() {
	$('.wintext').fadeOut(500).remove();
	$('.losetext').fadeOut(500).remove();
	$('.tryagain').fadeOut(500).remove();
	$('.continue').fadeOut(500).remove();

	for(i = 0; i < PATTERN_LENGTH; i++) {
		var id = "#sw" + i;
		$(id).remove();
	}
	
}
