var baseUrl = process.env.BASE_URI || "localdocker:4000";

module.exports = {
  approveFeed: function(message, recipient, group) {
    return "<p>" + message["user"]["userName"] + " has approved the feed for their " + message["election"].date.substring(0,10) + " " +
      message["election"].election_type + " election for publication. It was approved by" + message["user"]["userName"] + " (" +
           message["user"]["email"] + ").</p>" +
           "<p><a href='https://" + baseUrl + "/#/feeds/" + message[":public-id"] + "'>Go to the Data Dashboard</a></p>";
  },
  processedFeed: function(message, recipient, group) {
    return "<p>" + recipient.givenName + ",</p>" +
           "<p>The data you provided for " + group.description + "'s election is available for you to review on the VIP Data Dashboard.</p>" +
           "<p>Please click the link below to review your feed.</p>" +
           "<p><a href='https://" + baseUrl + "/#/feeds/" + message[":public-id"] + "'>Go to the Data Dashboard</a></p>" +
           "<p>If you have any questions, please contact <a href='mailto:vip@democracy.works'>vip@democracy.works</a>.</p>" +
           "<p>Thank you!</p>";
  },
  errorDuringProcessing: function(message) {
    return 'It looks like a feed failed during processing. Here\'s the information we got: \
            \nMessage we got: ' + JSON.stringify(message);
  }
}
