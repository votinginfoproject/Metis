var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable("assignments", {
    columns: {id: {type: 'uuid', primaryKey: true},
              early_vote_site_id: {type: 'uuid',
                                   notNull: true},
               schedule_id: {type: 'uuid',
                             notNull: true}},
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable("assignments", {ifExists: true}, callback);
};
