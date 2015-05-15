VotingInfoApp
=============

Voting Information Project web app.

[Learn more](https://votinginfoproject.org/)

## Running in Docker

> To run in docker, the simplest way is to have [docker-compose](https://docs.docker.com/compose/)
> installed (`brew install docker-compose`).

1. `docker-compose build`
1. `docker-compose up`
1. Then hit [http://localdocker:4000/](http://localdocker:4000/), assuming you have a localdocker host file entry pointing to your docker host. If not, replace localdocker with your docker host IP address.
1. Any of the feeds in the `upload/` directory when you built will be available for feed processing when you log in to the application, just put the name in the text area at the bottom and submit for feed processing.

## Prerequisites

* [Node.js](http://nodejs.org)
* [Grunt](http://gruntjs.com)
    * Install Grunt CLI `npm install -g grunt-cli`
* [Bower](http://bower.io)
    * Intall Bower `npm install -g bower`
* [MongoDB](http://http://www.mongodb.org/)

## Getting Started

1. Download node.js modules using `npm install`
2. Download libraries using `bower install`
3. Import reference data into Mongo
4. Run the app with `node app.js`

## Available Grunt Commands

* `grunt sass` - compile Sass files to css
* `grunt gjslint` - run the Closure Linter to inspect our JavaScript files
* `grunt watch` - watch for changes to the Sass and HTML files and automatically reload the page in your browser (requires [LiveReload](http://livereload.com/) or [LiveReload Chrome extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en))

## Adding a User Account in Crowd

1. Log into the Crowd Server (link coming sooon)
2. Click on `Users` tab
3. Click on `Add User` in sidebar
4. Enter user information and click `Create` button, which should take you to details for the new user
5. Add the user to `vip-user` group and click `Update`

For more information see the [Crowd Admin Guide](https://confluence.atlassian.com/display/CROWD/Crowd+Administration+Guide).

## Running Mongo from script

You can run Mongo in a similar manner to the Dockerized version from the data directory. This will initialize the seed data for counties and states at startup, and make mongo available on localhost at the standard port.

1. cd data
2. Run `mongo/mongo.sh --counties counties.json --states stateFIPS.json --config mongod.conf`

## Resetting the Database

1. Run `mongo metis --eval "db.dropDatabase()"`

## Importing Data into Mongo

1. Run `mongoimport -d metis -c counties < data/counties.json`
2. Run `mongoimport -d metis -c statefips < data/statefips.json`

## Running Karma Unit Tests

1. install karma
```
npm install karma
```
2. locate karma executable, usually in ./node_modules/karma/bin/karma, either symlink it to
   a directory in your PATH, or use the full path when running it.
3. run karma
```
karma start _name of config file_
```

WebStorm also has a built in build configuration for karma which breaks down each test.
Karma is configured to use chrome as the default browser.

## Running Functional Tests

1. Give permissions to public/test/RunFunctional.sh
```
chmod +x RunFunctional.sh
```
2. Run mongo
```
mongod --config /usr/local/etc/mongod.conf
```
(assuming a homebrew install, otherwise locate your mongod.conf and use it instead)
3. Execute the script
```
public/test/RunFunctional.sh
```
4. Open a browser to run the tests once the script brings up the server, see output for
   URL.

## Running Jasmine-Node Unit Tests

1. install jasmine-node
```
npm install jasmine-node -g
```
2. Run Unit Tests
```
jasmine-node public/test/nodeUnit
```
