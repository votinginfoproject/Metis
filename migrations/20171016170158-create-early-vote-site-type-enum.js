var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql("CREATE TYPE early_vote_site_type AS ENUM('early_vote_site','polling_location','drop_box');", callback);
};

exports.down = function(db, callback) {
  db.runSql("DROP TYPE early_vote_site_type;", callback);
};
