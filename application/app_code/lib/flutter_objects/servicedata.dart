/// This class is the service class.
/// It contains all information about a service
class ServiceData {
  final String name;
  final String description;
  final DateTime createdAt;

  /// Constructor of the service class
  const ServiceData({
    required this.name,
    required this.description,
    required this.createdAt,
  });

  /// Convert a json map into the class
  factory ServiceData.fromJson(Map<String, dynamic> json) {
    return ServiceData(
      name: json['service']['name'],
      description: json['service']['description'],
      createdAt: json["service"]["createdAt"],
    );
  }
}
