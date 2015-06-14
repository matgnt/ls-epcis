# Keywords
EPCIS, RFID, IoT, Industrie 4.0, Industry 4.0, Smart Factory, JSON-LD

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

### JSON-LD
The idea is to use linked data with JSON. You can find more at:
http://json-ld.org/

Unfortunately there is no schema for EPCIS yet. We probably have to define the types (according to the XML specification).

A list of exsiting types can be found at:
http://schema.org/docs/full.html


# Start it
Before you can start it, you have to laod the submodules:
```
git submodule init
git submodule update
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
You can easily scale the system with e.g. starting more dummy event generators:
```
docker-compose scale eventgenerator=5
```
This just generates more events, but you can also start new storagworkers to cope with teh new load:
```
docker-compose scale storageworker=5
```
In the RabbitMQ web interface you can now see 5 connections for the input.json queue.

And that's the big adavantage of this system. It scales without any additional effort. Just add more resources.


# Docker help
If you encounter an error you can check the image. Just export it and open the *.tar file
```
docker ps -a	# lists all containers
docker export -o tmp.tar CONTAINER_ID
```
The CONTAINER_ID is not the IMAGE_ID!

## Build and debug Docker images
When you bild an image, tag it! That you can run it with the tag name. Otherwise, it's a unique ID.
```
docker build --tag=epcis_xml2jsonworker --no-cache=true .
```
This makes sure no existing cache is being used. You can now find the newly built image with:
```
bash-3.2$ docker images | grep -i epcis
epcis_xml2jsonworker   latest              a39ac43305aa        5 minutes ago       354.4 MB
epcis_storageworker    latest              721ad801e805        16 minutes ago      308.6 MB
epcis_rabbitmqmaster   latest              2215db426a5c        13 days ago         227.2 MB
```
Since the image has its own entrypoint, you can run it with:
```
docker run epcis_xml2jsonworker
```
If you want to log into this image, you can do this while it's already running with:
```
bash-3.2$ docker ps
CONTAINER ID        IMAGE                         COMMAND                CREATED             STATUS              PORTS               NAMES
38c9609f960d        epcis_xml2jsonworker:latest   "/nodejs/bin/npm sta   4 seconds ago       Up 4 seconds                            serene_turing

docker exec -i -t 38c9609f960d /bin/bash 
```
Where you have to replace the *CONTAINER ID* that you've got from the *ps* command!
