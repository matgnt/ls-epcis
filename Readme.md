# Keywords
EPCIS, RFID, IoT, Industrie 4.0, Industry 4.0, Smart Factory

# Introduction
This is supposed to become a lightweight, but very scalable EPCIS repository. EPCIS stands for Electronic Product Code Information Services and is a standard interface to share location and status information of any kind of product you might have.

For more information checkout the following links:

http://en.wikipedia.org/wiki/EPCIS

http://www.gs1.org/epcis

There are a couple of EPCIS products out there already. Well known in the enterprise world is the *Object Event Repository (OER)* by SAP.
http://help.sap.com/saphelp_autoid70/helpdata/en/48/bed834de933095e10000000a421937/frameset.htm

The open source world knows *fosstrak*, a JAVA implementation.
https://code.google.com/p/fosstrak/wiki/EpcisMain 


## The hassle
The idea behind EPCIS is great! But sometimes it's a bit too much :-)

Today we're used to use very simple APIs, usually some JSON REST interfaces. Why can't we have something like this for EPCIS too? Wouldn't it be great to enable the hundreds and thousands of web developers out there to build nice looking applications around EPCIS?

## The idea / the plan
The idea is to use state of the art technology to build an easy to use and easy to scale EPCIS repository.
Currently the plan is to use the following key components:
* RabbitMQ as a scalable message broker
* MongoDB as a scalable NoSql database
* NodeJS for the EPCIS capture interface and for all the different workers
* JSON instead of XML as the main format.
* Websockets to push messages to web clients
* Docker to easily deploy all the services and workers to a cloud infrastructure

## Architecture Draft
![Architecture Draft](/architecture.jpg?raw=true "Architecture Draft")

## Architecture Decisions
### Why JSON instead of XML?
We'll still handle all the XML (EPCIS standardized) messages, but with more and more web applications we want to create around the system, we think JSON is a better format.
Additionally, we plan to directly send messages from the PLC level and MQTT in combination with JSON is an easier to implement protocol there as well.

# Start it
Before you can start it, you have to laod the submodules:
```
git submodule init
git sumodule update
```
This loads the modified RabbitMQ Dockerfile, which includes STOMP and MQTT plugins enabled.

Now you can start the services:
```
boot2docker up			# Only on Mac or Windows
source ./dockerrc		# To communicate with boot2docker. Check that the ip in the ./dockerrc file matches your local settings (output of the previous command...)
docker-compose build	# Not needed everytime, but to initially build the docker images
docker-compose up		# Start the whole thing...
```

RabbitMQ is accessible through the web interface (admin/admin) on http://192.168.59.103:15672

You can now send EPCIS (XML) messages to "amq.topic" "input.xml" and it will be forwarded to "input.json" after converting it.

# Docker at scale
*Docker Swarm* currently doesn't support communication between the nodes. As soon as this works, we can start any amount of workers to cope with increasing load.

# Docker help
If you encounter an error you can check the image. Just export it and open the *.tar file
```
docker ps -a	# lists all containers
docker export -o tmp.tar CONTAINER_ID
```
The CONTAINER_ID is not the IMAGE_ID!

