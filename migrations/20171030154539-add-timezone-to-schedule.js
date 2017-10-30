var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql("alter table schedules add column timezone varchar(10) not null", callback);
};

exports.down = function(db, callback) {
  db.runSql("alter table schedule drop column timezone", callback);
};
