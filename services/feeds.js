/**
 * Created by bantonides on 12/3/13.
 */
var utils = require('./utils');
//var retrieveFeeds = require('../retrievefeeds');

var registerFeedsServices = function (app) {
  /*
   * REST endpoints associated with Feed data
   */
  app.get('/services/feeds', utils.ensureAuthentication, allFeedsGET);


};

/*
 TODO: Implement something like...
  dbHandle = require("../db");
  var mockFeeds = dbHandle().retrieve_feeds();
*/
//In the meanwhile, continue to use the dummy values..
var mockFeeds = [
  {
    date: '2014/11/04',
    state: 'VA',
    type: 'General1',
    status: 'Revisions Needed',
    edit: 'vipfeed-37-2014-11-04'
  },
  {
    date: '2014/11/05',
    state: 'OH',
    type: 'General2',
    status: 'Revisions Needed',
    edit: 'vipfeed-37-2014-11-05'
  },
  {
    date: '2014/11/06',
    state: 'MD',
    type: 'General3',
    status: 'Revisions Needed',
    edit: 'vipfeed-37-2014-11-06'
  },
  {
    date: '2014/11/07',
    state: 'CA',
    type: 'General4',
    status: 'Revisions Needed',
    edit: 'vipfeed-37-2014-11-07'
  },
  {
    date: '2014/11/08',
    state: 'TX',
    type: 'General5',
    status: 'Revisions Needed',
    edit: 'vipfeed-37-2014-11-08'
  }
];

/*
 * Callbacks for HTTP verbs
 */
allFeedsGET = function (req, res) {
  res.json(mockFeeds);
};

exports.registerFeedsServices = registerFeedsServices;