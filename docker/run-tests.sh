#!/bin/bash

set -e

export PATH=/metis/node_modules/.bin:$PATH
export PHANTOMJS_BIN=/metis/node_modules/.bin/phantomjs

cd /metis
karma start karma.config.js
