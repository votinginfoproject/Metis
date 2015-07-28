/**
 * Created by bantonides on 11/21/13.
 */
var config = {};

// Log path is relative (should not start with a slash '/', but requires the end slash '/')
// Log folder will be created if it doesn't exist.
// Log level defaults to 'debug' in development, and 'info' in production
config.log = {
  logpath: 'logs/',
  logname: 'vip.log',
  lognameErrors: 'vip-errors.log',
  lognameExceptions: 'vip-exceptions.log',
  lognameSeparateProfile: 'separateProfile.log',
  logProfileEnabled: false,
  loglevel: 'info',
  maxsizeMB: 2, // 2MB max log size
  maxFiles:  3   // 3 log files in rotation
  // ,papertrail: {
  //   host: '<<INSERT YOUR PAPERTRAIL HOST URL, ie logs.papertrailapp.com',
  //   port: <<INSERT YOUR PAPERTRAIL PORT #>>,
  //   appname: 'metis' //how you want the source identified in papertrail
  // }
};

config.web = {
  port: process.env.PORT || 4000,
  favicon: 'public/assets/images/favicon.ico',
  loglevel: 'dev',
  sessionsecret: 'ssshh!!',
  enableSSL: false,
  SSLKey: '/vipdata/certs/*_votinginfoproject_org.key',
  SSLCert: '/vipdata/certs/*_votinginfoproject_org_chained.crt'
};

config.auth = {
  uselocalauth: function() {
    return !config.auth.apiKey ||
      !config.auth.apiKeySecret ||
      !config.auth.accountStore ||
      !config.auth.appHref;
  },
  apiKey: process.env.STORMPATH_API_KEY_ID,
  apiKeySecret: process.env.STORMPATH_API_KEY_SECRET,
  appHref: process.env.STORMPATH_APP_HREF,
  accountStore: process.env.STORMPATH_ACCOUNT_STORE
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

config.importer = {
  useS3: false,
  s3AccessKeyId: 'FillInAccessKeyHere',
  s3SecretAccessKey: 'FillInSecretAccessKeyHere',
  s3Region: 'us-east-1',
}

// Add more states if required.
config.checkSingleHouseStates = function(fipsCode) {
  return fipsCode === 39 || fipsCode === 32;
}

module.exports = config;
