/// This class is the ErrorData class.
/// It contains all information about an Error
class ErrorData {
  String errorMessage;

  /// Constructor of the ErrorData class
  ErrorData({
    required this.errorMessage,
  });

  /// Convert a json map into the class
  factory ErrorData.fromJson(Map<String, dynamic> json) {
    return ErrorData(
      errorMessage: json['data']['message'],
    );
  }
}
