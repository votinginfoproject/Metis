/**
 * Created by rcartier13 on 12/23/13.
 */

var isTesting = false;
var mockingVars = {

  setupProxyE2E: function () {
    if(!isTesting)
      return;

    var config = require('../../config');

    config.mongoose.connectionString = 'mongodb://localhost/e2eMetis';
  }
};