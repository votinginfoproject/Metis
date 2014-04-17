/**
 * Created by rcartier13 on 3/7/14.
 */

function endElement(label) {
  return "</" + label + ">\n";
}

function startElement(label, attributeLabel, attribute, attributeLabel2, attribute2) {
  if(attribute2) {
    return "<" + label + " "+ attributeLabel + "=\"" + attribute + "\" " + attributeLabel2 + "=\"" + attribute2 + "\">\n"
  }
  else if(!attribute) {
    return "<" + label + ">\n";
  }
  else {
    return "<" + label + " "+ attributeLabel + "=\"" + attribute + "\">\n"
  }
}

function startEndElement(label, data) {
  return '<' + label + '>' + data + '</' + label + '>\n';
}

function startEndAttributeElement(label, attributeLabel, attribute, data) {
  if(attribute)
    return "<" + label + " " + attributeLabel + "=\"" + attribute + "\">" + data + "</" + label + ">\n";
  else
    return startEndElement(label, data);
}

function testEmptyObject(obj) {
  var keys = Object.keys(obj);
  for(var i = 0; i < keys.length; ++i) {
    if(obj[keys[i]] && keys[i] !== 'toObject')
      return true;
  };

  return false;
}

exports.endElement = endElement;
exports.startElement = startElement;
exports.startEndElement = startEndElement;
exports.startEndAttributeElement = startEndAttributeElement;
exports.testEmptyObject = testEmptyObject;