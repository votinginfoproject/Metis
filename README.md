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

### Dependencies

* `npm install`
* `./node_modules/.bin/bower install`

### Setup

* Compile SASS: `./node_modules/.bin/grunt sass`

### Configuration

Create a `.env` file in the root directory, copy the following into
it, and provide values for your Postgres database and RabbitMQ server.

```
DB_ENV_POSTGRES_DATABASE=
DB_ENV_POSTGRES_PASSWORD=
DB_ENV_POSTGRES_USER=
DB_PORT_5432_TCP_ADDR=
DB_PORT_5432_TCP_PORT=
RABBITMQ_PORT_5672_TCP_ADDR=
RABBITMQ_PORT_5672_TCP_PORT=
VIP_DP_RABBITMQ_EXCHANGE=
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


[data-processor]: https://github.com/votinginfoproject/data-processor
[node]: http://nodejs.org
[grunt]: http://gruntjs.com
[bower]: http://bower.io
[postgres]: http://www.postgresql.org/
[rabbitmq]: http://www.rabbitmq.com/
