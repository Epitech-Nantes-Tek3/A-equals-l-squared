/// This class is the ErrorData class.
/// It contains all information about a Error
class ErrorData {
  final String errorMessage;

  /// Constructor of the ErrorData class
  const ErrorData({
    required this.errorMessage,
  });

  /// Convert a json map into the class
  factory ErrorData.fromJson(Map<String, dynamic> json) {
    return ErrorData(
      errorMessage: json['errorMessage'],
    );
  }
}
