function getProperty(obj, propertyName) {
  var result = obj;
  propertyName.split(".").forEach(function (prop) {
    result = result[prop];
  });
  return result;
}

exports.getProperty = getProperty;