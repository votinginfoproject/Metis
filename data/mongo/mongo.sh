#!/bin/bash

while [[ $# > 1 ]]
do
key="$1"

case $key in
    --counties)
    COUNTIES="$2"
    shift
    ;;
    --states)
    STATES="$2"
    shift
    ;;
    --config)
    CONFIG="$2"
    shift
    ;;
    *)
            # unknown option
    ;;
esac
shift
done

if [[ -z $CONFIG ]]; then
  mongod --smallfiles &
else
  mongod --config $CONFIG &
fi
sleep 5
mongoimport -d metis -c counties < $COUNTIES
mongoimport -d metis -c statefips < $STATES
wait
