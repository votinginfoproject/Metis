var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql("alter table assignments add constraint early_vote_site_id_schedule_id_unique unique (early_vote_site_id, schedule_id);", callback);
};

exports.down = function(db, callback) {
  db.runSql("alter table assignments drop constraint early_vote_site_id_schedule_id_unique;", callback);
};
