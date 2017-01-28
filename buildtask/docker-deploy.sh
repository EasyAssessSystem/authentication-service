#!/usr/bin/env bash

TARGET_SERVER="59.110.152.96"
APP_ENV="prod"
APP_DATA_DIR="/authentication-data"
DOCKER_IMAGE="registry-vpc.cn-beijing.aliyuncs.com/easyassess/authentication-service"
HOST_CONFIG="{\"Binds\":[\"/authentication-data:/app/data\"],\"PortBindings\":{\"1337/tcp\": [{ \"HostPort\": \"1337\"}]}}"
CONTAINER_CONFIG="{\"Name\": \"authentication-service\",\"Image\": \"$DOCKER_IMAGE\", \"Env\":[\"ES_ENV=prod\"], \"ExposedPorts\": {\"1337/tcp\": {}}, \"HostConfig\": $HOST_CONFIG}"
#pull image
curl -v -X POST "http://$TARGET_SERVER:2376/images/create?fromImage=$DOCKER_IMAGE"
curl -v -H "Content-type: application/json" -X DELETE "http://$TARGET_SERVER:2376/containers/authentication-service?force=true"
curl -v -H "Content-type: application/json" -X POST -d "$CONTAINER_CONFIG" "http://$TARGET_SERVER:2376/containers/create?name=authentication-service"
curl -v -H "Content-type: application/json" -X POST "http://$TARGET_SERVER:2376/containers/authentication-service/start"