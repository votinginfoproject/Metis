# This starts with oracle-jdk-7-supervisor because it needs supervisor
# and it is easier for us to maintain just two inheritance chains
# (supervisor+JDK & just JDK) rather than adding a third one for just supervisor.
FROM quay.io/democracyworks/oracle-jdk-7-supervisor:latest
MAINTAINER Democracy Works, Inc. <dev@democracy.works>

# install MongoDB
RUN apt-get install -y mongodb
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
CMD ["/run.sh"]
