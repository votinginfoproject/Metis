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
```

### Start it up

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

To deploy you will need the `data-dashboard-staging.pem` key and access to [quay](https://quay.io/) where the docker container images are hosted

1. run `./script/build` to build the docker image
2. if you've successfully built the image, you should see output at the end that looks like this: `If you'd like to push this to the Docker repo, run: docker push quay.io/votinginfoproject/metis:master-somehash`; run that command to push the container to quay
3. run `PEM_FILE=~/.ssh/data-dashboard-staging.pem ./script/deploy` to deploy to production

[data-processor]: https://github.com/votinginfoproject/data-processor
[node]: http://nodejs.org
[grunt]: http://gruntjs.com
[bower]: http://bower.io
[postgres]: http://www.postgresql.org/
[rabbitmq]: http://www.rabbitmq.com/
[ruby]: https://www.ruby-lang.org
[sass]: http://sass-lang.com
