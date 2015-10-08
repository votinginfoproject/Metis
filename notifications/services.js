var sender = require('./sender');

function registerNotificationServices (app) {
  app.post('/notifications/approve-feed', function(req, res) {
    sender.sendNotifications(req.body.data, 'approveFeed');
    res.send('POST sent to /notifications/approve-feed');
  });
}

exports.registerNotificationServices = registerNotificationServices;