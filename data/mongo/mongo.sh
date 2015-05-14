#!/bin/bash

mongod --smallfiles &
sleep 5
mongoimport -d metis -c counties < data/counties.json
mongoimport -d metis -c statefips < data/stateFIPS.json
wait
