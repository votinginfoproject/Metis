var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable("schedules", {
    columns: {id: {type: 'uuid', primaryKey: true},
              election_id: {type: 'uuid',
                            notNull: true},
              start_date: {type: 'date', notNull: true},
              end_date: {type: 'date', notNull: true},
              start_time: {type: 'time without time zone', notNull: true},
              end_time: {type: 'time without time zone', notNull: true},
              timezone: {type: 'string', notNull: true}},
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable("schedules", {ifExists: true}, callback);
};
