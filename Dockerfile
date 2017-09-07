FROM quay.io/democracyworks/clojure-and-node:lein-2.7.1-node-8.4.0
MAINTAINER Democracy Works, Inc. <dev@democracy.works>

RUN apt-get update && \
    apt-get install -y ruby rubygems-integration inotify-tools build-essential && \
	gem install sass -v 3.3.14

# install Grunt
RUN npm install -g grunt-cli
RUN npm install -g bower
RUN npm install node-sass@3.8.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY bower.json /usr/src/app/
COPY .bowerrc /usr/src/app/
RUN bower --allow-root install

COPY . /usr/src/app

EXPOSE 4000 27017 28017

ENTRYPOINT [ "grunt" ]
CMD [ "default" ]
