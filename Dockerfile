FROM democracyworks/base:latest
MAINTAINER Democracy Works, Inc. <dev@turbovote.org>

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

# add app code to container
ADD . /metis

# setup supervisor
RUN chmod +x /metis/docker/*.sh
RUN ln -s /metis/docker/supervisord-mongodb.conf /etc/supervisor/conf.d/
RUN ln -s /metis/docker/supervisord-import-seed-data.conf /etc/supervisor/conf.d/
RUN ln -s /metis/docker/supervisord-metis.conf /etc/supervisor/conf.d/

# install app dependencies
RUN cd /metis && npm install
RUN cd /metis && bower --allow-root install

# link tests script to a convenient place
RUN ln -s /metis/docker/run-tests.sh /run-tests.sh

# run the app
EXPOSE 4000 27017 28017
CMD ["/run.sh"]
