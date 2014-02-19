/**
 * Created by bantonides on 2/10/14.
 */
function mapError(error) {
  return {
    severity_code: error._id.severityCode,
    severity_text: error._id.severityText,
    error_code: error._id.errorCode,
    title: error._id.title,
    details: error._id.details,
    textual_references: error.textualReferences,
    error_count: error.count
  };
}

exports.mapError = mapError;