# This starts with clojure-api-supervisor because it needs supervisor
# and it is easier for us to maintain one Docker inheritance chain rather than
# three (clojure-api, clojure-api-supervisor, and supervisor). One day Docker
# will hopefully obviate the need for this with some shiny new INCLUDE command
# or something similar. - WM 2014-7-29
FROM node:0.12.2-onbuild
MAINTAINER Democracy Works, Inc. <dev@democracy.works>

# install Grunt
RUN npm install -g grunt-cli
RUN npm install -g bower

# install build-essential for dependencies that need that stuff
# RUN apt-get install -y build-essential

# install bower deps (TODO: move this to cached step)
RUN cd /usr/src/app && bower --allow-root install

# run the app
EXPOSE 4000 27017 28017
