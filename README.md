VotingInfoApp
=============

Voting Information Project web app.

[Learn more](https://votinginfoproject.org/)

## Running

If you've been running the [data-processor][data-processor] with `lein run`
you can run Metis locally to show a dashboard for that data.

### Prerequisites

* [Node.js][node]
* [Grunt][grunt]
    * Install Grunt CLI `npm install grunt-cli`
* [Bower][bower]
    * Intall Bower `npm install bower`
* [Postgres][postgres]
* [RabbitMQ][rabbitmq]
* [Ruby][ruby]
* [Sass][sass]
    * Install Sass `gem install sass`

### Dependencies

* `npm install`
* `./node_modules/.bin/bower install`

### Setup

* Compile SASS: `./node_modules/.bin/grunt sass`
* Create databases: `create db dataprocessor`, `create db earlyvote`

### Configuration

#### Auth0 Clients

The application requires two auth0 clients to be configured, one for the dashboard (angular app),
and one for the API (express app). The dashboard client is responsible for authenticating
users when they log in, and setting up the JWT header so protected backend calls can
succeed. There isn't direct front-end authentication, if an API call comes back with a
401 Unauthorized response, it simply returns to the login screen.

The express app has two distinct authentication roles. The primary one is to check
the JWT on protected API calls, and responding with a 401 if the user isn't
authenticated or authorized. The second function is to query the Auth0 UserManagement
API to find users by FIPS codes to be notified when a file is done processing.

All this means, there are two different sets of configurations for Auth0, and the
environment variables will tell you if it's for the `_DASHBOARD` or the `_EXPRESS`.
The Dashboard configuration is turned into a `config.js` file so that the Angular app
can have environment specific configuration, and this is typically achieved via
a `grunt-replace` task. Check out the Gruntfile.js to see what environment variables
it expects in order to generate the config for the Angular app.

Create a `.env` file in the root directory, copy the following into
it, and provide values for your Postgres database and RabbitMQ server and
Auth0 client for the Express app.

```
DB_ENV_POSTGRES_DATABASE=dataprocessor
DB_ENV_POSTGRES_PASSWORD=
DB_ENV_POSTGRES_USER=dataprocessor
DB_PORT_5432_TCP_ADDR=localhost
DB_PORT_5432_TCP_PORT=5432
RABBITMQ_PORT_5672_TCP_ADDR=localhost
RABBITMQ_PORT_5672_TCP_PORT=5672
VIP_DP_RABBITMQ_EXCHANGE=data-processor-exchange
AUTH0_CLIENT_ID_EXPRESS=some-client-id
AUTH0_CLIENT_SECRET_EXPRESS=some-client-id
AUTH0_AUDIENCE_EXPRESS=some-audience-uri
AUTH0_DOMAIN_EXPRESS=some.auth0.com
VIP_BATT_BUCKET_NAME=some-s3-bucket-name
DATA_CENTRALIZATION_BUCKET_NAME=some-s3-bucket-name
EV_DB_ENV_POSTGRES_DATABASE=earlyvote
EV_DB_ENV_POSTGRES_PASSWORD=
EV_DB_ENV_POSTGRES_USER=dataprocessor
EV_DB_PORT_5432_TCP_ADDR=localhost
EV_DB_PORT_5432_TCP_PORT=5432
DATABASE_URL=postgres://dataprocessor@localhost/earlyvote
```

There should be at least two clients configured in Auth0, one is a Single Page Web Application
and that's for the Dashboard. The other is a non-interactive client, and that's for
the Express API. So pull you actual env vars from the proper clients.

### Start it up

You have a couple of options to run locally. You can use node directly, or you can use grunt. The benefits of using grunt are:
* It mirrors how we run it in production
* It compiles SASS for you
* It monitors changes in html/sass/js files and restarts the node app
* Most importantly, it builds an config.js file for the Angular app to facilitate logging into Auth0. However, you need to put all the same AUTH0 env vars above into your local environment, or put them at the front of the command. An easy way to run it is with a `run-local` script that puts your env vars before the command, like this:
```
AUTH0_DOMAIN_DASHBOARD=<auth0_domain> AUTH0_CLIENT_ID_DASHBOARD=<auth0_client_id>  AUTH0_REDIRECT_URI_DASHBOARD="http://localhost:4000/#/login-callback"
AUTH0_AUDIENCE_DASHBOARD="some-audience-uri" ./node_modules/.bin/grunt default
```

Grunt:
```sh
./node_modules/.bin/grunt default
```

Basic:
```sh
node app.js
```

Load [http://localhost:4000](http://localhost:4000) in a browser. You
can log in using the accounts in `authentication/strategy.js`. The
super user account is "testuser" and its password is "test".

If you don't like running with Grunt, then after you've run it once to create
the Angular config file, you can return to using `node app.js` if you like.

## Running in Docker

> To run in docker, the simplest way is to have [docker-compose](https://docs.docker.com/compose/)
> installed (`brew install docker-compose`).

1. `docker-compose build`
1. `docker-compose up`
1. Then hit [http://localdocker:4000/](http://localdocker:4000/), assuming you have a localdocker host file entry pointing to your docker host. If not, replace localdocker with your docker host IP address.

## Deploying the Project

To deploy you will need the ssh key for the environment you are deploying to, access to [quay](https://quay.io/) where the docker container images are hosted, and the IP address for the cluster you wish to deploy to

1. set the environment variable `FLEETCTL_TUNNEL` to the IP address of the cluster you're deploying to (`export FLEETCTL_TUNNEL=<ip_address>`)
1. run `docker login quay.io` to login to quay
2. run `./script/build staging|production` to build the docker image (use either `staging` or `production` depending on the environment you are deploying to.
2. if you've successfully built the image, you should see output at the end that looks like this: `If you'd like to push this to the Docker repo, run: docker push quay.io/votinginfoproject/metis:master-somehash`; run that command to push the container to quay
3. run `PEM_FILE=<path_to_pem_file> ./script/deploy` to deploy

[data-processor]: https://github.com/votinginfoproject/data-processor
[node]: http://nodejs.org
[grunt]: http://gruntjs.com
[bower]: http://bower.io
[postgres]: http://www.postgresql.org/
[rabbitmq]: http://www.rabbitmq.com/
[ruby]: https://www.ruby-lang.org
[sass]: http://sass-lang.com
