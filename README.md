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
* Create databases: `create db dataprocessor`, `create db datadashboard`

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
it expects in order to generate the config for the Angular app. This also means the
`_DASHBOARD` environment variables need to be provided outside of the `.env` file
(see below), as that file is only loaded when the node server starts up. In order for
the Grunt tasks to be able to configure the `_DASHBOARD` auth0 settings, they have to
be already in the environment when grunt is run. As such, developers can either put
them in their shell environment, or create a `script/run-local` script that
inline sets the environment variables before calling grunt.

E.G. source for `script/run-local`
```
#!/bin/bash

AUTH0_AUDIENCE_DASHBOARD=some-audience-uri AUTH0_DOMAIN_DASHBOARD=vip-dashboard-local.auth0.com AUTH0_CLIENT_ID_DASHBOARD=some-client-id AUTH0_REDIRECT_URI_DASHBOARD="http://10.0.2.2:4000/#/login-callback" ./node_modules/.bin/grunt default
```

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
VIT_API_KEY=<civic info api key with access to staged/dress rehearsal data>
AUTH0_CLIENT_ID_EXPRESS=some-client-id
AUTH0_CLIENT_SECRET_EXPRESS=some-client-id
AUTH0_DOMAIN_EXPRESS=some.auth0.com
AUTH0_AUDIENCE_EXPRESS=some-audience-uri
VIP_BATT_BUCKET_NAME=some-s3-bucket-name
AWS_ACCESS_KEY_ID=some-aws-access-key
AWS_SECRET_ACCESS_KEY=some-aws-secret-key
AWS_REGION=us-east-1
FEED_SUCCESS_SQS_URL=feed-success-sqs-url
FEED_FAILURE_SQS_URL=feed-failure-sqs-url
DATA_UPLOAD_BUCKET_NAME=some-s3-bucket-name
DASHBOARD_DB_ENV_POSTGRES_DATABASE=datadashboard
DASHBOARD_DB_ENV_POSTGRES_PASSWORD=
DASHBOARD_DB_ENV_POSTGRES_USER=dataprocessor
DASHBOARD_DB_PORT_5432_TCP_ADDR=localhost
DASHBOARD_DB_PORT_5432_TCP_PORT=5432
DATABASE_URL=postgres://dataprocessor@localhost/datadashboard
EARLY_VOTE_SITES_BUCKET_NAME=early-vote-site-date-development
DASHER_DOMAIN=localhost:3000
DASHER_HTTP_PROTOCOL="http"
ADDRESS_TEST_SUCCESS_SQS_URL=address-test-success-sqs-url
ADDRESS_TEST_FAILURE_SQS_URL=address-test-failure-sqs-url
ADDRESS_TEST_REQUEST_SQS_URL=address-test-request-sqs-url
```

There should be at least two clients configured in Auth0, one is a Single Page Web Application
and that's for the Dashboard. The other is a non-interactive client, and that's for
the Express API. So pull you actual env vars from the proper clients.

### Testing - Early Vote Site

Early Vote Site has Clojurescript tests that are run by the `doo` plugin, and the command has been aliased to:

`lein test`

It will compile the Clojurescript to JS and run the tests as specified in `early-vote-site.test-runner` namespace.
If you create a new test namespace in another file, simply require it in the `test-runner` and it will be run so
long as it is in a namespace that starts with `early-vote-site`.

### Compiling - Early Vote Site

The Early Vote Site is a single-page `re-frame` app. You can set it to auto-compile changes to the Clojurescript with:

`lein cljsbuild auto dev` 

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

### Running in Docker

> To run in docker, the simplest way is to have [docker-compose](https://docs.docker.com/compose/)
> installed (`brew install docker-compose`).

1. `docker-compose build`
1. `docker-compose up`
1. Then hit [http://localdocker:4000/](http://localdocker:4000/), assuming you have a localdocker host file entry pointing to your docker host. If not, replace localdocker with your docker host IP address.

## Dasher Integration

As we start to move new functionality over to `dasher`, there will be functions
we'll expose here in `Metis` but pass over to `dasher` for actual execution. To
do this we configure `DASHER_DOMAIN` to point to where `dasher` is running.

In order for this to work, `dasher` is also set up to do JWT authentication and
is sharing the client id/client secret so that the authentication is seemless.

Currently the following features are being sent through the Node Express server
over to `dasher`:

* Generate New API Key (on the Profile page)

## Deploying the Project

### Automatic

Merges to `master` branch will be deployed to production automatically.

### Manual

To deploy you will need the ssh key for the environment you are deploying to, access to [quay](https://quay.io/) where the docker container images are hosted, and the IP address for the cluster you wish to deploy to

1. set the environment variable `FLEETCTL_TUNNEL` to the IP address of the cluster you're deploying to (`export FLEETCTL_TUNNEL=<ip_address>`), and if needed, add the ssh key to your agent, e.g. `ssh-add ~/.ssh/key.pem` where `key.pem` is the appropriate key for the environment you are deploying to.
1. run `docker login quay.io` to login to quay
2. run `./script/build staging|production` to build the docker image (use either `staging` or `production` depending on the environment you are deploying to.
2. if you've successfully built the image, you should see output at the end that looks like this: `If you'd like to push this to the Docker repo, run: docker push quay.io/votinginfoproject/metis:master-somehash`; run that command to push the container to quay
3. run `./script/deploy` to deploy

[data-processor]: https://github.com/votinginfoproject/data-processor
[node]: http://nodejs.org
[grunt]: http://gruntjs.com
[bower]: http://bower.io
[postgres]: http://www.postgresql.org/
[rabbitmq]: http://www.rabbitmq.com/
[ruby]: https://www.ruby-lang.org
[sass]: http://sass-lang.com
