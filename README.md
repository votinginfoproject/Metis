VotingInfoApp
=============

Voting Information Project web app.

[Learn more](https://votinginfoproject.org/)

## Running in Docker

> The only prerequisite for this is [Docker](http://docker.io/). You don't need
> to install the prerequisites in the list below when using Docker.

1. `docker build -t votinginfoproject/metis .`
1. `docker run -d -p 4000:4000 votinginfoproject/metis`
1. Then hit [http://localhost:4000/](http://localhost:4000/) (or [http://localdocker:4000/](http://localdocker:4000/) with docker-osx)

### Running tests in Docker

> Just the karma tests for now. TODO: Run the other tests in /run-tests.sh too.

1. `docker run votinginfoproject/metis /run-tests.sh`

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
