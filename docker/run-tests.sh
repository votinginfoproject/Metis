#!/bin/bash

set -e

export PATH=/metis/node_modules/.bin:$PATH

cd /metis
karma start karma.config.js
