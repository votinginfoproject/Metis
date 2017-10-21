var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable("elections", {
    columns: {id: {type: 'uuid', primaryKey: true},
              state_fips: {type: 'string', notNull: true},
              election_date: {type: 'date', notNull: true}},
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable("elections", {ifExists: true}, callback);
};
