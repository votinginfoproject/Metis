
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.json({ page: 'index', project: 'VotingInfoApp' });
};