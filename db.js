/**
 * Created by Akelaus on 12/4/13.
 */

//app configuration
var config = require('./config');

//database setup
var mongoose = require('mongoose');
mongoose.connect(config.mongoose.connectionString);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function callback(){
  console.log("initialized VIP database via Mongoose");
});

function retrieve_feeds(){

  var FeedSchema = mongoose.Schema({
     //payload: Buffer,
    election_date: Date,
    loaded_on: Date,
    validation_status: Boolean,
    feed_status: String,
    feed_type: String,
    name: String,  //edit for JSON
    state: String,  //will eventually be a VIP ID (TODO: consider for sprint 2)
    date: Date,
    election_id: String,
    vip_id: String
  });
  mongoose.model(config.mongoose.model.feed, FeedSchema);
  var Feed = mongoose.model(config.mongoose.model.feed);

  Feed.find({},{payload: 0},function (arr,data) {
    //console.log(data);
    console.log(data);
    //TODO: return data; <--- ensure that callback is populating data
  });
}

module.exports = function(){
  return {
    process_path: function(){
      return retrieve_feeds();
    }
  };
}

//TODO: test your Mongo instance connectivity by un-commenting the following line
//log_feeds();
