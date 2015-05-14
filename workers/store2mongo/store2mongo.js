
var amqp = require('amqp');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

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
            console.log(" [x] Received %s", message);
			
            var jsonObj = JSON.parse(message);
            createDBitem(jsonObj);
        });
    });
});


connection.on('error', function (err) {

    console.log("Error");
    console.log(err);
});
