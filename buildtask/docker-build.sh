#!/usr/bin/env bash

docker build --no-cache=true -f ./buildtask/Dockerfile -t registry.cn-beijing.aliyuncs.com/easyassess/authentication-service:latest ./
