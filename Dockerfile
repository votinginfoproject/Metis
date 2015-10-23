FROM node:0.12.2
MAINTAINER Democracy Works, Inc. <dev@democracy.works>

# install Grunt
RUN npm install -g grunt-cli
RUN npm install -g bower
RUN npm install -g node-sass

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY bower.json /usr/src/app/
COPY .bowerrc /usr/src/app/
RUN bower --allow-root install

COPY . /usr/src/app

RUN node-sass public/assets/css/app.scss public/assets/css/app.css

EXPOSE 4000 27017 28017

CMD [ "npm", "start" ]
