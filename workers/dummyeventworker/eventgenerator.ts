var amqp = require('amqp');
var sleep = require('sleep');
import epcis = require('./node_modules/epcis-js/lib/epcisevents');

var connection = amqp.createConnection({
    host: '192.168.59.103',
    login: 'admin',
    password: 'admin'
});

connection.on('error', function (err) {

    console.log("Error: Could not connect to AMQP broker:");
    console.log(err);
});

connection.on('ready', function() {
	var exchange = this.exchange('amq.topic');

	exchange.on('error', function (err) {
		console.log(err);
	});

	exchange.on('open', function () {
	while (true) {
		sleep.sleep(3);
		var event = new epcis.EPCIS.AggregationEvent();
		var dt = new Date();
		event.eventTime = dt;
		// TODO: add more meaningful properties
		
		// send the event
		//var msg = JSON.stringify(event, null, 4);
		console.log('Sending msg...');
		this.publish('input.json', event);
	}	
		
	});

});
