/// This class is the Error class.
/// It contains all information about a Error
class Error {
  final String error;

  /// Constructor of the Error class
  const Error({
    required this.error,
  });

  /// Convert a json map into the class
  factory Error.fromJson(Map<String, dynamic> json) {
    return Error(
      error: json['errorMessage'],
    );
  }
}
