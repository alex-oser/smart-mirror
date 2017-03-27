var smart = {};
var mirror = [];
smart.mirror = mirror;

var s0; 
var s1;
var s2;
var s3;
var s4;

var t0; 
var t1;
var t2;
var t3;
var t4;

var icon;

var weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 
	'Thursday', 'Friday', 'Saturday');
var monthArray = new Array('January', 'February', 'March', 'April', 
	'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

function getNews() {
	$.getJSON("https://www.reddit.com/r/worldnews/hot.json?limit=5", function(data) { 
	response = data['data']['children'];
	s0 = response[0]["data"]["title"];
	s1 = response[1]["data"]["title"];
	s2 = response[2]["data"]["title"];
	s3 = response[3]["data"]["title"];
	s4 = response[4]["data"]["title"];
	$("#news").remove();
	document.body.innerHTML += "<div id = 'news'><strong>World News</strong> <br>1. "+s0+
		"<br>2. "+s1+"<br>3. "+s2+"<br>4. "+s3+"<br>5. "+s4+"</div>";
	});
	var t = setTimeout(getNews, 21600000);
}

function getDate() {
	var today = new Date();
	var currentDay = today.getDay();
	var currentWeekday = weekday[currentDay]; // day of the week indicator
	var day = today.getDate(); // numeric day indication
	var month = today.getMonth();
	var currentMonth = monthArray[month]; // Month name
	var year = today.getFullYear(); // Year
	$("#dateTime").remove();
	document.body.innerHTML += "<div id='dateTime'><div id='time'></div><br><br>Today is "+
		currentWeekday+"<br><br>"+currentMonth+" "+day+", "+year+"</div>";
}

function getWeather() {
	$.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?q=Stlouis&cnt=5&units=imperial&APPID=3d071b639d43c27b77365e5142049015", function(data) { 
	city = data['city']['name'];
	response = data['list'];
	t0 = response[0]["temp"]["day"];
	t1 = response[1]["temp"]["day"];
	t2 = response[2]["temp"]["day"];
	t3 = response[3]["temp"]["day"];
	t4 = response[4]["temp"]["day"];
	icon = response[0]["weather"][0]["icon"];
	$("#weather").remove();
	document.body.innerHTML += "<div id = 'weather'><img style= 'height:100px; width:100px' src = 'WeatherIcons/"+
		icon+".png'></img><div id='dailyTemp'>&nbsp;"+(Math.round(t0*10)/10)+"&nbsp;&#8457;</div>";
	var t = setTimeout(getWeather, 14400000);
	});
}

function getTime() {
    var today = new Date();
    var hours = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML =
    hours + ":" + m + ":" + s;
    if (hours == 00 && m == 00 && s == 00) {
    	getDate();
    }
    var t = setTimeout(getTime, 500);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

$(document).ready( function() {
	var body = document.getElementsByTagName("body")[0];
	var height = $(window).height();
	var width = $(window).width();
	$(document).ready( function() {
		$('body').css("width", height + "px");
		$('body').css("height", width + "px");
	});

	getNews();
	getDate();
	getTime();
	getWeather();
});