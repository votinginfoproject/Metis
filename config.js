/**
 * Created by bantonides on 11/21/13.
 */
var os = require("os");

var config = {};

// Log path is relative (should not start with a slash '/', but requires the end slash '/')
// Log folder will be created if it doesn't exist.
// Log level defaults to 'debug' in development, and 'info' in production
config.log = {
  loglevel: 'info',
  syslog: {
    host: process.env.SYSLOG_PORT_514_UDP_ADDR,
    port: process.env.SYSLOG_PORT_514_UDP_PORT,
    app_name: 'DataDashboard',
    localhost: os.hostname()
  }
};

config.web = {
  port: process.env.PORT || 4000,
  favicon: 'public/assets/images/favicon.ico',
  loglevel: 'dev'
};

config.session = {
  ttl: 3600,
  reapInterval: 3600
}

config.email = {
  fromAddress: process.env.VIP_DP_SES_FROM,
  rateLimit: 1
}

config.aws = {
  accessKey: process.env.AWS_ACCESS_KEY_ID,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  sqs: {feedSuccessURL: process.env.FEED_SUCCESS_SQS_URL,
        feedFailureURL: process.env.FEED_FAILURE_SQS_URL,
        addressTestSuccessURL: process.env.ADDRESS_TEST_SUCCESS_SQS_URL,
        addressTestFailureURL: process.env.ADDRESS_TEST_FAILURE_SQS_URL,
        addressTestRequestURL: process.env.ADDRESS_TEST_REQUEST_SQS_URL}
}

// Add more states if required.
config.checkSingleHouseStates = function(fipsCode) {
  return fipsCode === 39 || fipsCode === 32;
}

config.vit = {
  apiKey: process.env.VIT_API_KEY
}

config.auth0 = {
  domain: process.env.AUTH0_DOMAIN_EXPRESS,
  audience: process.env.AUTH0_AUDIENCE_EXPRESS,
  clientID: process.env.AUTH0_CLIENT_ID_EXPRESS,
  secret: process.env.AUTH0_CLIENT_SECRET_EXPRESS
}

config.batt = {
  batchAddressBucket: process.env.VIP_BATT_BUCKET_NAME
}

config.dataUpload = {
  bucket: process.env.DATA_UPLOAD_BUCKET_NAME
}

config.earlyVoteSites = {
  bucket: process.env.EARLY_VOTE_SITES_BUCKET_NAME
}

config.slack = {
  webhook: process.env.SLACK_WEBHOOK,
  payload: {channel: process.env.SLACK_NOTIFICATION_CHANNEL,
            username: process.env.SLACK_BOT_NAME,
            link_names: true,
            icon_emoji: process.env.SLACK_BOT_EMOJI}
}

config.dasher = {
  domain: process.env.DASHER_DOMAIN,
  protocol: process.env.DASHER_HTTP_PROTOCOL || 'https'
}

module.exports = config;
