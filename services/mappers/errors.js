/**
 * Created by bantonides on 2/10/14.
 */
function mapError(error) {
  return {
    severity_code: error.severityCode,
    severity_text: error.severityText,
    error_code: error.errorCode,
    title: error.title,
    details: error.details,
    textual_reference: error.textualReference
  };
}

exports.mapError = mapError;