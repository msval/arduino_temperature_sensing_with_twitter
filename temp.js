var serial = require( "serialport" );
var SerialPort = serial.SerialPort;
var twit = require("twit");
var cron = require('cron');

// Replace with the device name in your machine.
var portName = "/dev/tty.usbmodemfa1221";
 
var sp = new SerialPort( portName, {
    baudrate:9600,
    parser  :serial.parsers.readline( "\n" )
} );

var twitter = new twit({
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: ''
});

var temps = [];
var lights = [];
var soilHumidities = [];

sp.on("data", function ( data ) {
	var dataArray = data.split(',');

	var temperature = dataArray[0];
	var lightLevel = dataArray[1];
	var soilHumidity = dataArray[2];

	if (temperature !== undefined && !isNaN(temperature)) {
		var temp = parseFloat(temperature);
		if (!isNaN(temp)) {
			temps.push(temp);
		}
	}

	if (lightLevel !== undefined && !isNaN(lightLevel)) {
		lights.push(parseInt(lightLevel, 10));
	}

	if (soilHumidity !== undefined && !isNaN(soilHumidity)) {
		soilHumidities.push(parseInt(soilHumidity, 10));
	}
});

var cronJob = cron.job("0 * * * * *", function(){
	var sum = 0;
	for (var i = 0; i < temps.length; i++) {
		sum += temps[i];
	}
	var avgTemp = (sum / temps.length).toFixed(2);
	temps.length = 0;

	sum = 0;
	for (i = 0; i < lights.length; i++) {
		sum += lights[i];
	}
	var avgLight = Math.round(sum / lights.length);
	lights.length = 0;

	sum = 0;
	for (i = 0; i < soilHumidities.length; i++) {
		sum += soilHumidities[i];
	}
	var avgSoilHumidity = Math.round(sum / soilHumidities.length);
	soilHumidities.length = 0;
	
	var tweet = 'Plant sensor - ';
	tweet += 'avgTemp ' + avgTemp + '°C avgLight ' + avgLight + '% avgSoilHumidity ' + avgSoilHumidity + '%';

	twitter.post('statuses/update', { status: tweet }, function(err, reply) {
		if (err) {
			console.dir(err);
		} else {
			console.log(tweet);
		}
	});
});

cronJob.start();