/**
 * Created by bantonides on 12/13/13.
 */
var models = {};

/*
 * Mongoose Schema Definitions
 */
var feedSchema = {
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
};

/*
 * End of Schema Definitions
 */
exports.models = models;

exports.initSchemas = function(config, mongoose) {
  models.Feed = mongoose.model(config.mongoose.model.feed, mongoose.Schema(feedSchema));
};



