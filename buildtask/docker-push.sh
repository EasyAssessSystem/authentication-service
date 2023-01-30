#!/usr/bin/env bash

docker login -u ${DOCKER_REPO_USER} -p ${DOCKER_REPO_PWD}
docker tag ${DOCKER_REPO}/authentication-service ${DOCKER_REPO}/authentication-service:latest
docker push ${DOCKER_REPO}/authentication-service:latest
