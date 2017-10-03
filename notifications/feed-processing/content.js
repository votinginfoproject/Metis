var baseUrl = process.env.BASE_URI || "localdocker:4000";

var codes = {
  "admin": "Admin Group",
  "01": "Alabama",
  "02": "Alaska",
  "04": "Arizona",
  "05": "Arkansas",
  "06": "California",
  "08": "Colorado",
  "09": "Connecticut",
  "10": "Delaware",
  "11": "District of Columbia",
  "12": "Florida",
  "13": "Georgia",
  "15": "Hawaii",
  "16": "Idaho",
  "17": "Illinois",
  "18": "Indiana",
  "19": "Iowa",
  "20": "Kansas",
  "21": "Kentucky",
  "22": "Louisiana",
  "23": "Maine",
  "24": "Maryland",
  "25": "Massachusetts",
  "26": "Michigan",
  "27": "Minnesota",
  "28": "Mississippi",
  "29": "Missouri",
  "30": "Montana",
  "31": "Nebraska",
  "32": "Nevada",
  "33": "New Hampshire",
  "34": "New Jersey",
  "35": "New Mexico",
  "36": "New York",
  "37": "North Carolina",
  "38": "North Dakota",
  "39": "Ohio",
  "40": "Oklahoma",
  "41": "Oregon",
  "42": "Pennsylvania",
  "44": "Rhode Island",
  "45": "South Carolina",
  "46": "South Dakota",
  "47": "Tennessee",
  "48": "Texas",
  "49": "Utah",
  "50": "Vermont",
  "51": "Virginia",
  "53": "Washington",
  "54": "West Virginia",
  "55": "Wisconsin",
  "56": "Wyoming"}

function codeToDescription (code) {
  return codes.code;
};

var getGivenName = function(recipient) {
  if (recipient.user_metadata !== undefined && recipient.user_metadata.givenName !== undefined) {
    return recipient.user_metadata.givenName
  } else if (recipient.name !== undefined) {
    return recipient.name
  } else {
    return recipient.email
  }
};

module.exports = {
  approveFeed: function(message, recipient, fips) {
    return "<p>" + message["user"]["userName"] + " has approved the feed for their " + message["election"].date.substring(0,10) + " " +
      message["election"].election_type + " election for publication. It was approved by " + message["user"]["userName"] + " (" +
           message["user"]["email"] + ").</p>" +
           "<p><a href='https://" + baseUrl + "/#/feeds/" + message[":public-id"] + "'>Go to the Data Dashboard</a></p>";
  },
  processedFeed: function(message, recipient, fips) {
    return "<p>" + getGivenName(recipient) + ",</p>" +
           "<p>The data you provided for " + codeToDescription(fips) + "'s election is available for you to review on the VIP Data Dashboard.</p>" +
           "<p>Please click the link below to review your feed.</p>" +
           "<p><a href='https://" + baseUrl + "/#/feeds/" + message[":public-id"] + "'>Go to the Data Dashboard</a></p>" +
           "<p>If you have any questions, please contact <a href='mailto:vip@democracy.works'>vip@democracy.works</a>.</p>" +
           "<p>Thank you!</p>";
  },
  v5processedFeed: function(message, recipient, fips) {
    return "<p>" + getGivenName(recipient) + ",</p>" +
           "<p>The data you provided for " + codeToDescription(fips) + "'s election has been processed.</p>" +
           "<p>Please click the link below for an error report.</p>" +
           "<p><a href='https://" + baseUrl + "/db/feeds/" + message[":public-id"] + "/xml/errors/report'>Go to the Data Dashboard</a></p>" +
           "<p>If you have any questions, please contact <a href='mailto:vip@democracy.works'>vip@democracy.works</a>.</p>" +
           "<p>Thank you!</p>";
  },
  errorDuringProcessing: function(message) {
    return 'It looks like a feed failed during processing. Here\'s the information we got: \
            \nMessage we got: ' + JSON.stringify(message);
  }
}
