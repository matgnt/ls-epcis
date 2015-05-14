
var amqp = require('amqp');
var xml2js = require('xml2js');

// options to parse the EPCIS xml structure into JS
var parserOptions = {
    'trim': true,
    'ignoreAttrs': true,
    'explicitArray': false
};

var parseEPCIS = function (data) {
    var parser = new xml2js.Parser(parserOptions);

    parser.parseString(data, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            var body = result['epcis:EPCISDocument']['EPCISBody']['EventList']['ObjectEvent'];
            var msg = JSON.stringify(body, null, 4);
            console.log(msg);
            resend(msg);
        }
        console.log('Done');
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
