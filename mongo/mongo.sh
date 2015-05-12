#!/bin/bash

mongod --config mongod.conf --smallfiles &
sleep 5
mongoimport -d metis -c counties < counties.json
mongoimport -d metis -c statefips < stateFIPS.json
wait
