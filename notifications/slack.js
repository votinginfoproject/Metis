var logger = (require('../logging/vip-winston')).Logger;
var config = require('../config');
var request = require('request');

var message = function (text) {
  if (config.slack.webhook && config.slack.payload.channel) {
    var payload = Object.assign({}, {"text": text}, config.slack.payload);
    request({url: config.slack.webhook,
             method: "POST",
             json: true,
             body: payload},
            function (error, response, body) {
              if (error) {
                console.log("Slack Message got an error: ", error);
              }
              if (response && response.statusCode && response.statusCode != 200) {
                console.log('Slack Message got an unexpected statusCode:', response.statusCode);
              }
            });
  } else {
    logger.error("Slack configuration does not appear to be set, couldn't send: " + text);
  }
};

exports.message = message;
