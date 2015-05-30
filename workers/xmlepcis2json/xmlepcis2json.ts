
import amqp = require('amqp');
import xml2js = require('xml2js');
import assert = require('assert');
import epcisparser = require('epcis-js/lib/epcisparser');
import epcisevents = require('epcis-js/lib/epcisevents');

// send the result to the broker again
var resend = function (data) {
    console.log('sending message...');
    var exchange = connection.exchange(name='amq.topic');
    exchange.publish(routingKey='input.json', body=data);
    console.log('sending message... Done');
};



var connection = amqp.createConnection({
    host: '192.168.59.103',
    login: 'admin',
    password: 'admin'
});

connection.on('ready', function () {
    connection.queue('input.xml', { autoDelete: false }, function (queue) {
        queue.bind(routing='input.xml');
        console.log(' [*] Waiting for messages. To exit press CTRL+C');

        var parser:epcisparser.EPCIS.EpcisParser = new epcisparser.EPCIS.EpcisParser();
        queue.subscribe(function (msg) {
            var message = msg.data.toString('utf-8');
            console.log(" [x] Received %s", message);
			
            // convert from EPCIS xml to json
			parser.parse(message, function(err:any, result:epcisevents.EPCIS.Events) {
                assert.equal(null, err, "Error occured while parsing the EPCIS events");
                
                var sendMsg = JSON.stringify(result, null, 4);
                resend(sendMsg);
            });
            
        });
    });
});


connection.on('error', function (err) {

    console.log("Error");
    console.log(err);
});
