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

config.notifications = {
  exchange: process.env.VIP_DP_RABBITMQ_EXCHANGE,
  exchangeOptions: { durable: false, autoDelete: true},
  host: process.env.RABBITMQ_PORT_5672_TCP_ADDR,
  port: process.env.RABBITMQ_PORT_5672_TCP_PORT,
  topics: {
    processingComplete: "processing.complete"
  }
}

config.email = {
  fromAddress: process.env.VIP_DP_SES_FROM,
  adminGroup: process.env.STORMPATH_ADMIN_GROUP,
  rateLimit: 1
}

config.aws = {
  accessKey: process.env.VIP_DP_AWS_ACCESS_KEY,
  secretKey: process.env.VIP_DP_AWS_SECRET_KEY,
  ses: {region: process.env.VIP_DP_SES_REGION},
  sqs: {region: process.env.VIP_DP_SQS_REGION,
        feedSuccessURL: process.env.VIP_DP_SQS_FEED_SUCCESS_URL,
        feedFailureURL: process.env.VIP_DP_SQS_FEED_FAILURE_URL}
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
