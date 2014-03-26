#!/bin/bash

set -e

mongoimport -d metis -c counties < /metis/data/counties.json
mongoimport -d metis -c stateFIPS < /metis/data/stateFIPS.json
