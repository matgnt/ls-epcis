
var amqp = require('amqp');
var xml2js = require('xml2js');
var assert = require('assert');

// options to parse the EPCIS xml structure into JS
var parserOptions = {
    'trim': true,
    'ignoreAttrs': true,
    'explicitArray': false
};

var parseEPCIS = function (data) {
    var parser = new xml2js.Parser(parserOptions);

    parser.parseString(data, function (err, result) {
        assert.equal(null, err, 'Parsing XML data failed!');
        
        // we only care for events
        var event = result['epcis:EPCISDocument']['EPCISBody']['EventList']['ObjectEvent'];
        assert.notEqual(null, event, 'No event found');

        // now let's prepare the message how it should look like in the JSON world
        if(event.epcList.epc) {
            event.epc = event.epcList.epc;
            event.epcList = undefined;
        }
        if(event.readPoint.id)
            event.readPoint = event.readPoint.id;
        if(event.bizLocation.id)
            event.bizLocation = event.bizLocation.id;
        if(event.bizTransactionList.bizTransaction) {
            event.bizTransaction = event.bizTransactionList.bizTransaction;
            event.bizTransactionList = undefined;
        }
        
        var msg = JSON.stringify(event, null, 4);
        console.log(msg);
        resend(msg);
    });

};


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

        queue.subscribe(function (msg) {
            var message = msg.data.toString('utf-8');
            console.log(" [x] Received %s", message);
			
            // convert from EPCIS xml to json
			
            parseEPCIS(message);
        });
    });
});


connection.on('error', function (err) {

    console.log("Error");
    console.log(err);
});
