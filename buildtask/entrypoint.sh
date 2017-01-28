#!/bin/bash

HOST_ADDRESS=$(ip addr | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
export ES_AUTHENTICATION_SERVER=$HOST_ADDRESS
node src/Server.js ${ES_ENV}