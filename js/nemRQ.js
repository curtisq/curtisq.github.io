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


		var classStr = "'shape2 " + colorClass + shapeClass + "'";
		var element = "<div id=" + id + " class=" + classStr + ">" + num + "</div>";
		var elementWrapper = "<div id='sw" + i + "' class='wrapper'>" + element + "</div>";
		patternElements.push([col,sha,num]);
		$('.patternDiv').append(elementWrapper);
	}

	console.log(patternElements);
	NProgress.configure({ minimum: 0.0 });
	NProgress.configure({ trickle: false });
	NProgress.configure({ ease: 'ease', speed: 200 });
	NProgress.configure({ parent: '#kbd' });
	NProgress.set(0.0);

	//return;
	var keyboardType = Math.floor((Math.random() * 3));

	setTimeout(function(){
		generateKeyboard(keyboardType);
		bindClick(keyboardType);
		createTimer(TIME_ALLOWED);
	}, 5000);

}

function generateKeyboard(type) {
	
	for(i = 0; i < 12; i++) {
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
	$('#sw0').css("border", "2px solid red");
}

function shapeKeyboard() {
	var b0 = "<div id='b0' class=" + "'shape grey circle'" + ">" + "</div>";
	var b1 = "<div id='b1' class=" + "'shape grey triangle'" + ">" + "</div>";
	var b2 = "<div id='b2' class=" + "'shape grey square'" + ">" + "</div>";
	var b3 = "<div id='b3' class=" + "'shape grey pentagon2'" + ">" + "</div>";
	$('.keyboardDiv').append(b0).hide().fadeIn(2000);
	$('.keyboardDiv').append(b1);
	$('.keyboardDiv').append(b2);
	$('.keyboardDiv').append(b3);
}

function colorKeyboard() {
	var b0 = "<div id='b0' class=" + "'shape blue circle'" + ">" + "</div>";
	var b1 = "<div id='b1' class=" + "'shape pink circle'" + ">" + "</div>";
	var b2 = "<div id='b2' class=" + "'shape yellow circle'" + ">" + "</div>";
	var b3 = "<div id='b3' class=" + "'shape green circle'" + ">" + "</div>";
	$('.keyboardDiv').append(b0).hide().fadeIn(2000);
	$('.keyboardDiv').append(b1);
	$('.keyboardDiv').append(b2);
	$('.keyboardDiv').append(b3);
}

function numberKeyboard() {
	var b0 = "<div id='b0' class=" + "'shape grey circle'" + ">" + "0" + "</div>";
	var b1 = "<div id='b1' class=" + "'shape grey circle'" + ">" + "1" + "</div>";
	var b2 = "<div id='b2' class=" + "'shape grey circle'" + ">" + "2" + "</div>";
	var b3 = "<div id='b3' class=" + "'shape grey circle'" + ">" + "3" + "</div>";
	$('.keyboardDiv').append(b0).hide().fadeIn(2000);
	$('.keyboardDiv').append(b1);
	$('.keyboardDiv').append(b2);
	$('.keyboardDiv').append(b3);
}

//determine time till end
function createTimer(allowed) {
	var end = new Date();
	start_time = end;
	end.setSeconds(end.getSeconds() + allowed);
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
	console.log("going for " + dif_secs + " seconds");
	var pct = (TIME_ALLOWED - dif_secs) / TIME_ALLOWED;
	//Time is up
	if(now >= end_time) {
		NProgress.done();
		clearInterval(timer_id);
		outOfTime();
	}
	//update progress bar
	else {
		NProgress.set(pct + 0.01);
		//updateTimerBar();
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

function outOfTime() {

	for(i = 0; i < 12; i++) {
		var id = "#s" + i;
		$(id).show();
	}
	
	destroyKeyboard();
	alert("You ran out of time!");
}

function checkInput(button, keyboard) {
	
	var answer = patternElements[position][keyboard];
	console.log("answer is " + answer + " at position " + position);
	if(button == answer) {
		var id = "#s" + position;
		var wid = "#sw" + position;
		if((position+1) < patternElements.length) {
			$(id).fadeIn(200);
			$(wid).css("border", "none");
			position++;
			wid = "#sw" + position;
			$(wid).css("border", "2px solid red");
		}
		else {
			$(id).show();
			destroyKeyboard();
			clearInterval(timer_id);
			alert("YOU WIN! (You had " + total_incorrect + " incorrect answer(s).)");
		}
	}
	else {
		total_incorrect++;
		decrementTimer(1);
		console.log("INCORRECT");
	}
}

function destroyKeyboard() {
	$('.keyboardDiv').fadeOut(2000);
}
