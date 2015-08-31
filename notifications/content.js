module.exports = {
  processedFeed: function(message) {
    return 'Great job! You processed a feed. It has a public id. It\'s: ' + message[":public-id"] + '. Wow. Real cool.';
  },
  errorDuringProcessing: function(message) {
    return 'It looks like a feed failed during processing. Here\'s the information we got: \
            \nMessage we got: ' + JSON.stringify(message);
  }
}