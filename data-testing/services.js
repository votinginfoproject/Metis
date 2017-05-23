var post = require("./posts.js");

function registerDataVerificationServices (app) {
  app.post('/testing/upload', post.uploadAddressFile);
}

exports.registerDataVerificationServices = registerDataVerificationServices;
