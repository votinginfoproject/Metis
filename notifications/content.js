module.exports = {
  processedFeed: function(message) {
    return 'Great job! You processed a feed. It has a public id. It\'s: ' + message[":public-id"] + '. Wow. Real cool.';
  }
}