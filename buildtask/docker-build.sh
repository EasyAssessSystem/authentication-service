#!/usr/bin/env bash

docker build --no-cache=true -f ./buildtask/Dockerfile -t ${DOCKER_REPO}/authentication-service:latest ./
