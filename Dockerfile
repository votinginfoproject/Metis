# This starts with clojure-api-supervisor because it needs supervisor
# and it is easier for us to maintain one Docker inheritance chain rather than
# three (clojure-api, clojure-api-supervisor, and supervisor). One day Docker
# will hopefully obviate the need for this with some shiny new INCLUDE command
# or something similar. - WM 2014-7-29
FROM quay.io/democracyworks/clojure-api-supervisor:latest
MAINTAINER Democracy Works, Inc. <dev@democracy.works>

# install MongoDB
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
RUN apt-get update

RUN apt-get install -y mongodb-org
RUN mkdir -p /data/db

# install git (bower dependency)
RUN apt-get install -y git

# install Node
RUN add-apt-repository -y ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install -y nodejs

# install Grunt
RUN npm install -g grunt-cli
RUN npm install -g bower

# install build-essential for dependencies that need that stuff
RUN apt-get install -y build-essential

# install app dependencies
RUN mkdir /metis
WORKDIR /metis
ADD package.json /metis/
RUN npm install

# add app code to container
ADD . /metis

# setup supervisor
RUN chmod +x /metis/docker/*.sh
RUN ln -s /metis/docker/supervisord-mongodb.conf /etc/supervisor/conf.d/
RUN ln -s /metis/docker/supervisord-import-seed-data.conf /etc/supervisor/conf.d/
RUN ln -s /metis/docker/supervisord-metis.conf /etc/supervisor/conf.d/

# install bower deps (TODO: move this to cached step)
RUN cd /metis && bower --allow-root install

# setup test environment
RUN apt-get install -y libfreetype6 libfontconfig # needed by phantomjs
RUN ln -s /metis/docker/run-tests.sh /run-tests.sh

# run the app
EXPOSE 4000 27017 28017