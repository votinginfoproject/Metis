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

### Configuration

Create a `.env` file in the root directory, copy the following into
it, and provide values for your Postgres database and RabbitMQ server.

```
DB_ENV_POSTGRES_DATABASE=dataprocessor
DB_ENV_POSTGRES_PASSWORD=
DB_ENV_POSTGRES_USER=dataprocessor
DB_PORT_5432_TCP_ADDR=localhost
DB_PORT_5432_TCP_PORT=5432
RABBITMQ_PORT_5672_TCP_ADDR=localhost
RABBITMQ_PORT_5672_TCP_PORT=5672
VIP_DP_RABBITMQ_EXCHANGE=data-processor-exchange
AUTH0_CLIENT_ID=some-client-id
AUTH0_DOMAIN=some.auth0.com
AUTH0_AUDIENCE=http://some.auth0.com/something
AUTH0_REDIRECT_URI=http://localhost:4000/#/login-callback
```

### Start it up

You have a couple of options to run locally. You can use node directly, or you can use grunt. The benefits of using grunt are:
* It mirrors how we run it in production
* It compiles SASS for you
* It monitors changes in html/sass/js files and restarts the node app
* Most importantly, it builds an config.js file for the Angular app to facilitate logging into Auth0. However, you need to put all the same AUTH0 env vars above into your local environment, or put them at the front of the command. An easy way to run it is with a `run-local` script that puts your env vars before the command, like this:
```
AUTH0_DOMAIN=<auth0_domain> AUTH0_CLIENT_ID=<auth0_client_id> AUTH0_AUTH_AUDIENCE=<auth0_audience> AUTH0_REDIRECT_URI="http://localhost:4000/#/login-callback" grunt default
```

Grunt:
```sh
grunt default
```

Basic:
```sh
node app.js
```

Load [http://localhost:4000](http://localhost:4000) in a browser. You
can log in using the accounts in `authentication/strategy.js`. The
super user account is "testuser" and its password is "test".

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
2. run `./script/build` to build the docker image
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
