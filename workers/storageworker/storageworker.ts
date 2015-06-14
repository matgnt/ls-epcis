
import amqp = require('amqp');
import mongodb = require('mongodb');
import assert = require('assert');
import sleep = require('sleep');

// sleep to wait some time to get the other services startet.
// TODO: Check until the service port is available
sleep.sleep(3);

var MongoClient = mongodb.MongoClient;

var mydb = null;

// store event in DB
var createDBitem = function(data) {
	assert.notEqual(mydb, null, 'Exiting because db connection is null!');
    
    var collection = mydb.collection('events');
    collection.insert(data, null, function(err, res) {
       assert.equal(null, err, 'Error on writing object to DB');
       console.log('Successfully wrote to DB');
    });
};

MongoClient.connect('mongodb://192.168.59.103/EPCIS', function(err, db) {
  assert.equal(null, err);
  mydb = db;
  console.log("Connected correctly to MongoDB server");
});

var connection = amqp.createConnection({
    host: '192.168.59.103',
    login: 'admin',
    password: 'admin'
});

connection.on('ready', function () {
    connection.queue('input.json', { autoDelete: false }, function (queue) {
        queue.bind(routing='input.json');
        console.log(' [*] Waiting for messages. To exit press CTRL+C');

        queue.subscribe(function (msg) {
            var message = msg.data.toString('utf-8');
            //console.log(" [x] Received %s", message);
			
            var jsonObj = JSON.parse(message);

            if(isEvent(jsonObj)) {
                createDBitem(jsonObj);
            } else {
                var events = concatEvents(jsonObj);
                if(events) {
                    events.forEach(function (element) {
                        createDBitem(element);
                    });
                }
            }
        });
    });
});

// just check whether the given object is a valid event object already
function isEvent(obj:any): boolean {
    var allowedTypes:Array<string> = ['ObjectEvent', 'AggregationEvent', 'TransactionEvent'];
    var type = obj['type'];
    if(allowedTypes.indexOf(type) != -1) {
        // allowed type
        return true;
    }
    return false;
}

// just concat all events that we currently support
function concatEvents(obj:any): Array<any> {
    var events:Array<any> = new Array<any>();

    var eventNames:Array<string> = ['objectEvents', 'aggregationEvents', 'transactionEvents'];

    eventNames.forEach(function (eventName) {
        try {
            var tmpEvents:Array<any> = obj[eventName];
            if(tmpEvents) {
                events = events.concat(tmpEvents);
            }
        } catch (err) {
            console.log('Could not add events: ' + eventName + ' Error: ' + err);
        }
    });

    return events;
}

connection.on('error', function (err) {

    console.log("Error");
    console.log(err);
});
