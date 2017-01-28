#!/usr/bin/env bash
ES_ENV='prod'
ES_AUTHENTICATION_DATA_DIR=${ES_AUTHENTICATION_DATA_DIR}
CMD=$1

if [ ! -n "$ES_AUTHENTICATION_DATA_DIR" ] ;then
    ES_AUTHENTICATION_DATA_DIR=$PWD/data
fi

echo "Mount to " + $ES_AUTHENTICATION_DATA_DIR

docker rm -f authentication-service || echo "No started authentication service found"

docker run -it -v $ES_AUTHENTICATION_DATA_DIR:/app/data -p 1337:1337 --rm --name=authentication-service \
         -e ES_ENV=$ES_ENV \
         registry.cn-beijing.aliyuncs.com/easyassess/authentication-service \
         $CMD