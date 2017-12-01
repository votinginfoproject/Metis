var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable("early_vote_sites", {
    columns: {id: {type: 'uuid', primaryKey: true},
              election_id: {type: 'uuid',
                            notNull: true},
              county_fips: {type: 'string', notNull: true},
              type : {type: 'early_vote_site_type', notNull: true},
              name: {type: 'string', notNull: true},
              address_1: {type: 'string'},
              address_2: {type: 'string'},
              address_3: {type: 'string'},
              city: {type: 'string', notNull: true},
              state: {type: 'string', notNull: true},
              zip: {type: 'string'},
              directions: {type: 'string'},
              voter_services: {type: 'string'}},
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable("early_vote_sites", {ifExists: true}, callback);
};
