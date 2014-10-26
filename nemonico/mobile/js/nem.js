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
var MAX_LENGTH = 12;
var TIME_ALLOWED = 5;
var VIEW_TIME = 3000;
var VARIABLES = 1;
var REMEMBER_PATTERN = 1;
var DIFFICULTY = 1;
var NUMCHAR_TYPE = 1;
var BASE_POINTS = 100;
var CONTINUE_BUTTON = 0;

var position = 0;
var total_incorrect = 0;
var total_correct = 0;
var streak = 0;
var current_streak = 0;
var steak_multiplier = 1;
var time_total = 0;
var start_time;
var end_time;
var timer_id;
var game_won = 0;
var TIME_FOR_INCORRECT = 2.5;
var time_remaining;
var time_under_total = 0;
var total_score = 0;
function setDifficulty() {

	switch(DIFFICULTY) {
		case 0:
			VARIABLES = 1;
			REMEMBER_PATTERN = 1;
			break;
		case 1:
			VARIABLES = 2;
			REMEMBER_PATTERN = 1;
			break;
		case 2:
			VARIABLES = 3;
			REMEMBER_PATTERN = 1;
			break;
		case 3:
			VARIABLES = 1;
			REMEMBER_PATTERN = 0;
			break;
		case 4:
			VARIABLES = 2;
			REMEMBER_PATTERN = 0;
			break;
		case 5:
			VARIABLES = 3;
			REMEMBER_PATTERN = 0;
			break;
	}
	console.log("Difficulty set - vars:" + VARIABLES + " remember:" + REMEMBER_PATTERN);
}


function getShapeClass(sha) {
	var shapeClass = "";
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
	return shapeClass;
}

function getColorClass(col) {
	var colorClass = "";
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
	return colorClass;
}

function determineTimes() {
	if(REMEMBER_PATTERN) {
		VIEW_TIME = 1.25 + (VARIABLES * PATTERN_LENGTH / 2.5);
		TIME_ALLOWED = 3 + (VARIABLES * PATTERN_LENGTH / 1);
	}
	else {
		VIEW_TIME = 2 + (VARIABLES * PATTERN_LENGTH / 1);
		TIME_ALLOWED = 3 + (VARIABLES * PATTERN_LENGTH / 1);
	}
	TIME_FOR_INCORRECT = TIME_ALLOWED / 10;

	console.log("Round" + PATTERN_LENGTH + "| view:" + VIEW_TIME + " answer:" + TIME_ALLOWED + " penalty:" + TIME_FOR_INCORRECT);
	
	VIEW_TIME *= 1000; //for ms
}

function rememberMain() {
	var s1 = new Shape();
	s1.reroll()
	col = s1.getColor();
	sha = s1.getShape();
	num = s1.getNumber();
	var shapeClass = getShapeClass(sha);
	var colorClass = getColorClass(col);
	var numchar = getNumchar(num, 1);

	var elementWrapper = getPatternElement(shapeClass, colorClass, numchar, PATTERN_LENGTH-1);

	patternElements.push([col,sha,num]);
	
	$(elementWrapper).appendTo('.patternDiv').hide();
	
	for(i = 0; i < PATTERN_LENGTH; i++) {
		var id = "#sw" + i;
		$(id).fadeIn(250);
	}

	console.log(patternElements);
	NProgress.configure({ minimum: 0.0 });
	NProgress.configure({ trickle: false });
	NProgress.configure({ ease: 'ease', speed: 200 });
	NProgress.configure({ parent: '.progressBar' });
	NProgress.set(0.0);

	//return;
	var keyboardType = Math.floor((Math.random() * VARIABLES));

	setTimeout(function(){
		generateKeyboard(keyboardType);
		bindClick(keyboardType);
		createTimer(TIME_ALLOWED);
	}, VIEW_TIME);

}

function getPatternElement(shapeClass,colorClass,numchar, idnum) {
	var SVG = 1;

	var id = "'s" + idnum + "'";
	var svgid = "'svg" + idnum + "'";
	
	if(SVG) {	
		var element = '<svg id=' + svgid + 'class="appear" version="1.1" id="Shapes" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 88 88" enable-background="new 0 0 44 44" xml:space="preserve">';
		switch(VARIABLES) {
			case 1:
				element += '<circle id=' + id + ' class="' + colorClass + '" cx="44" cy="44" r="38"/>';
				element += '</svg>';
				break;
			case 2:
				if(shapeClass == 'circle2 ') {
				element += '<circle id=' + id + ' class="' + colorClass + '" cx="44" cy="44" r="38"/>';
				}
				else if(shapeClass == 'pentagon2 ') {
				element += '<polygon id=' + id + ' class="' + colorClass + '" points="19.3,80 4,35 44,6 84,35 68.7,80 "/>';
				}
				else if(shapeClass == 'triangle2 ') {
				element += '<polygon id=' + id + ' class="' + colorClass + '" points="4,80 44,8 84,80 "/>';
				}
				else if(shapeClass == 'square2 ') {
				element += '<rect id=' + id + ' class="' + colorClass + '" x="8" y="8" width="72" height="72"/>';
				}
				element += '</svg>';
				break;
		}
		var elementWrapper = "<div id='sw" + idnum + "' class='shape-wrapper placeholder'>" + element + "</div>";
	}
	else {
		switch(VARIABLES) {
			case 1:
				var classStr = "'shape2 " + colorClass + "circle2" + "'";
				var element = "<div id=" + id + " class=" + classStr + ">" + "</div>";
				break;
			case 2:
				var classStr = "'shape2 " + colorClass + shapeClass + "'";
				var element = "<div id=" + id + " class=" + classStr + ">" + "</div>";
				break;
			case 3:
				var classStr = "'shape2 " + colorClass + shapeClass + "'";
				var element = "<div id=" + id + " class=" + classStr + ">" + numchar + "</div>";
				break;
		}

		var elementWrapper = "<div id='sw" + idnum + "' class='wrapper placeholder'>" + element + "</div>";
	}	
		return elementWrapper;
}

function bindDifBtn(id, dif) {
	$(id).click(function(){
		console.log('Difficulty ' + dif);
		DIFFICULTY = dif;
		$("#mainmenu").fadeOut(1000);
		$("#gameboard").delay(1000).fadeIn(1000);
		setTimeout(function() {main();}, 2250);
	});
}

function difMenu() {
	$("#gameboard").hide();
	bindDifBtn('#alpha', 0);
	bindDifBtn('#beta', 1);
	bindDifBtn('#gamma', 2);
	bindDifBtn('#delta', 3);
	bindDifBtn('#epsilon', 4);
	bindDifBtn('#zeta', 5);

	$('.tutorialbtn').click(function(){
		openTutorial();
	});

	var cookie = $.cookie('first_visit');
	if(!cookie){
		console.log("First visit to this site");
		openTutorial();
		$.cookie('first_visit', 1);
	}
}

function openTutorial() {
	console.log("Opened Tutorial Overlay");
	$('#overlay').css("display", "block");
	$('#fade').css("display", "block");
}

function main() {
	setDifficulty();
	determineTimes();

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
		var shapeClass = getShapeClass(sha);
		var colorClass = getColorClass(col);
		var numchar = getNumchar(num, 1);

		var elementWrapper = getPatternElement(shapeClass, colorClass, numchar, i);

		patternElements.push([col,sha,num]);
		$(elementWrapper).appendTo('.patternDiv').hide().fadeIn(250);
	}

	console.log(patternElements);
	NProgress.configure({ minimum: 0.0 });
	NProgress.configure({ trickle: false });
	NProgress.configure({ ease: 'ease', speed: 200 });
	NProgress.configure({ parent: '.progressBar' });
	NProgress.set(0.0);

	//return;
	var keyboardType = Math.floor((Math.random() * VARIABLES));

	setTimeout(function(){
		generateKeyboard(keyboardType);
		bindClick(keyboardType);
		createTimer(TIME_ALLOWED);
	}, VIEW_TIME);

}

function getNumchar(num, type) {

	if(typeof(type)==='undefined') type = NUMCHAR_TYPE;
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


function hidePattern(delay) {
	var SVG = 1;
	
	if(SVG) {
		for(i = 0; i < PATTERN_LENGTH; i++) {
			var id = "#s" + i;
			var svgid = "#svg" + i;
			if(delay){
				$(svgid).delay(delay * i).attr("class", "disappear");
				$(id).delay(600).fadeOut(10);
				console.log("add disappear to " + svgid);
			}
			else{
				$(svgid).attr("class", "disappear").delay(600).hide();
			}
		}
	}
	else {
		for(i = 0; i < PATTERN_LENGTH; i++) {
			var id = "#s" + i;
			if(delay){
				$(id).delay(delay * i).fadeOut(200);
			}
			else{
				$(id).fadeOut(200);	
			}
		}
	}
}

function generateKeyboard(type) {

	hidePattern(125);

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
	var keyboard_delay = 125 * PATTERN_LENGTH;

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
	var keyboard_delay = 125 * PATTERN_LENGTH;

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
	var keyboard_delay = 125 * PATTERN_LENGTH;

	var b0 = "<div id='b0' class=" + "'pointer shape grey circle'" + ">" + getNumchar(0, 1) + "</div>";
	var b1 = "<div id='b1' class=" + "'pointer shape grey circle'" + ">" + getNumchar(1, 1) + "</div>";
	var b2 = "<div id='b2' class=" + "'pointer shape grey circle'" + ">" + getNumchar(2, 1) + "</div>";
	var b3 = "<div id='b3' class=" + "'pointer shape grey circle'" + ">" + getNumchar(3, 1) + "</div>";
	$(b0).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b1).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b2).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);
	$(b3).appendTo('.keyboardDiv').hide().delay(keyboard_delay).fadeIn(250);

}

//determine time untill end
function createTimer(allowed) {
	var keyboard_delay = 0.125 * PATTERN_LENGTH + 0.3;
	var end = new Date();
	start_time = new Date();
	end.setSeconds(end.getSeconds() + allowed + keyboard_delay);
	console.log("Timer ends at " + end); 
	end_time = end;

	timer_id = setInterval(checkTimer, 75);
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
		destroyKeyboard(100);
		//show pattern
		for(i = 0; i < PATTERN_LENGTH; i++) {
			var id = "#s" + i;
			$(id).fadeIn(250);
		}
		//clear gameboard after some time
		setTimeout(function() {gameOver(0);}, 2500);
	}
	//update progress bar
	else {
		NProgress.set(pct + 0.015);
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


function checkMultiplier() {

	if (current_streak < 5) {
		streak_multiplier = 1;
	}
	else if (current_streak >=5 && current_streak < 10) {
		streak_multiplier = 1.5;
	}
	else if (current_streak >=10 && current_streak < 15) {
		streak_multiplier = 2;
	}
	else if (current_streak >=15 && current_streak < 20) {
		streak_multiplier = 2.5;
	}
	else if (current_streak >=25 && current_streak < 30) {
		streak_multiplier = 3;
	}
	else if (current_streak >= 30) {
		streak_multiplier = 3.5;
	}
}

function checkInput(button, keyboard) {
	
	var answer = patternElements[position][keyboard];
	console.log("answer is " + answer + " at position " + position);
	if(button == answer) {
		//scoring
		total_correct++;
		current_streak++;
		if(current_streak > streak) streak = current_streak;
		checkMultiplier();
		total_score += BASE_POINTS * streak_multiplier
		//display
		$('#levelscore').text("Score: " + total_score);
		//score popup
		$("#notification").remove();
		var popup = "<span id='notification'>+";
		popup += BASE_POINTS * streak_multiplier;
		popup += "</span>"
		$("#notificationdiv").append(popup);
		//pattern elements
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
			$(wid).removeClass("currentshape");
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
		current_streak = 0;
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

	time_total += TIME_ALLOWED - time_remaining;
	destroyKeyboard(1000);
	var gameIsOver = 0;

	for(i = 0; i < PATTERN_LENGTH; i++) {
		var id = "#sw" + i;
		$(id).fadeOut(1000);
	}


	if(win) {
		//continue
		if(PATTERN_LENGTH < MAX_LENGTH) {
			var msg = "<h3 class='levelwin'>More</h3>";
			$(msg).appendTo('.patternDiv').hide().delay(1000).fadeIn(10);
			if(CONTINUE_BUTTON) {
				var contmsg = "<h3 class='pointer resulttext continue'>Continue</h3>";
				$(contmsg).appendTo('.patternDiv').hide().delay(1000).slideToggle(300);

				$('.continue').click(function(){
					loadNextRound();
				});
			}
		}
		//you beat all rounds
		else {
			gameIsOver = 1;
			calcFinalScore(win);
			makeStatsDiv(win, 1);
		}
	}
	//lost the game
	else {
		gameIsOver = 1;
		calcFinalScore(win);
		makeStatsDiv(win, 1);

		var retrymsg = "<h3 class='pointer resulttext tryagain'>Play Again</h3>";
		$(retrymsg).appendTo('.patternDiv').hide().delay(1200).fadeIn(500);

		$('.tryagain').click(function(){
			window.location.reload();
		});
	}	
	
	if(!CONTINUE_BUTTON && !gameIsOver) {
		setTimeout(loadNextRound, 3000);
	}

	makeStatsDiv(win, 0);
}

function loadNextRound() {
	var remember = REMEMBER_PATTERN;
	refreshBoard(remember);
	if(!remember) {
		patternElements = [];
	}
	PATTERN_LENGTH++;
	position = 0;
	determineTimes();
	if(remember) {
		setTimeout(rememberMain, 250);
	}
	else {
		setTimeout(main, 250);
	}
}

function makeStatsDiv(win, print) {

	var total_answers = total_correct + total_incorrect;
	var tperanswer = (time_total/ total_answers).toFixed(2);
	var streak_bonus = streak * (BASE_POINTS / 2);
	var time_bonus = Math.round(time_under_total * (BASE_POINTS / 1.3));
	console.log("STATS| Total_time: " + time_total.toFixed(2) + ", streak: " + streak + ", s/answer: " + tperanswer);
	console.log("STATS| answers: " + total_answers + ", correct: " + total_correct + ", incorrect: " + total_incorrect);
	console.log("STATS| score: " + total_score);
	if(print) {
		$('#levelscore').text("Nemonico");
		if(win) {
			var msg = "<h3 class='resulttext wintext'>Level Complete</h3>";
		}
		else {
			var msg = "<h3 class='losetext'>You Forgot</h3>";
		}
		
/*
	<table class='losetext' style='width:80%; margin:1em auto;'>"
	<h3 class="losetext">You Forgot</h3>
	    <table class="score" style="width:80%; margin:1em auto;">
			<tr>
				<td>Correct Answers</td>
				<td>50</td>
			</tr>
			<tr>
				<td>Time Bonus</td> 
				<td>94</td>
			</tr>
			<tr>
				<td>Streak Bonus</td> 
				<td>94</td>
			</tr>
		</table>
	<h3 class="">Final Score</h3>
	<h3 class="score">9999</h3>
*/

		msg += "<table class='scoretable'><tr><td>Score</td><td id='tableresults'>" + total_score + "<span class='points'>pts</span></td></tr>";
		msg += "<tr><td>Streak Bonus</td><td id='tableresults'>" + streak_bonus + "<span class='points'>pts</div></td></tr>";
		msg += "<tr><td>Time Bonus</td><td id='tableresults'>" + time_bonus + "<span class='points'>pts</span></td></tr></table>";
		msg += "<h3 class='finalscore'>Final Score</h3>" + "<h3 class='finalscore score' id='fscorehead'>" + total_score_adjusted + "</h3>";
		$(msg).appendTo('.patternDiv').hide().delay(1200).fadeIn(500);
		
/*		var baseAnim = new countUp("basescoretd", 0, total_score, 0, 6);
		setTimeout(baseAnim.start, 600);
		var streakAnim = new countUp("streakbonustd", 0, streak_bonus, 0, 5);
		setTimeout(streakAnim.start, 1800);
		var timeAnim = new countUp("timebonustd", 0, time_bonus, 0, 4);
		setTimeout(timeAnim.start, 3000);
*/

		var finalAnim = new countUp("fscorehead", 0, total_score_adjusted, 0, 4);
		setTimeout(finalAnim.start, 600);
	}
	return;
}

function calcFinalScore(win) {
	console.log("game over total_score is "  + total_score);
	total_score_adjusted = total_score;
	total_score_adjusted += time_under_total * (BASE_POINTS / 1.3);
	total_score_adjusted += streak * (BASE_POINTS /2);
	if (win) {
		total_score_adjusted *= 1.25;
	}
	total_score_adjusted = Math.round(total_score_adjusted);
	console.log("added time for points total score is now " + total_score_adjusted);
	$('#levelscore').text("Score: " + total_score_adjusted);
}

function refreshBoard(remember) {
	$('.wintext').fadeOut(500).remove();
	$('.losetext').fadeOut(500).remove();
	$('.tryagain').fadeOut(500).remove();
	$('.continue').fadeOut(500).remove();
	$('.levelwin').fadeOut(500).remove();

	if(remember){
	       	return;
	}

	for(i = 0; i < PATTERN_LENGTH; i++) {
		var id = "#sw" + i;
		$(id).remove();
	}
	
}
