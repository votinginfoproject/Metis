var util = require('./util.js');
var overviewQuery = "select r.id, state.name as state_name, \
                     elections.election_type as election_type, \
                     to_char(to_date(elections.date, 'MM/DD/YYYY'), 'YYYY-MM-DD') as election_date \
                     from results r \
                     left join v5_1_states state on state.results_id = r.id \
                     left join v5_1_elections elections on elections.results_id = r.id \
                     where r.public_id = $1;"

module.exports = {
  feedOverview: util.simpleQueryResponder(overviewQuery, util.paramExtractor()),
}
