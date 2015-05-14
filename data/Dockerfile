FROM mongo:2.6.9 
MAINTAINER Democracy Works, Inc. <dev@democracy.works>

RUN mkdir -p /home/mongo/data
WORKDIR /home/mongo

COPY mongo/mongo.sh /home/mongo/
COPY mongo/mongod.conf /home/mongo/
COPY counties.json /home/mongo/data/
COPY stateFIPS.json /home/mongo/data/

EXPOSE 27017 28017

CMD ["/home/mongo/mongo.sh"]
