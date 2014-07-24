/**
 * Created by bantonides on 2/10/14.
 */
function mapError(error) {
  return {
    severity_code: error.severityCode,
    severity_text: error.severityText,
    error_code: error._id.errorCode,
    title: error.title,
    details: error.details,
    textual_references: error.textualReferences,
    models: error.models,
    searches: error.searches,
    error_count: error.count
  };

}

exports.mapError = mapError;