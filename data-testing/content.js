var baseUrl = process.env.BASE_URI || "localdocker:4000";

module.exports = {
  testingComplete: function(message) {
    return "<p> Your batch address test has completed.  Go <a href='https://" + message['url'] + "'>here</a> to download \
            your results.</p> <p>It will be available for 72 hours.</p>";
  },
  errorDuringTesting: function(message) {
    return 'It looks like a batch address failed during processing. Here\'s the information we got: \
            \nMessage we got: ' + JSON.stringify(message);
  }
}
