/// This class is the service class.
/// It contains all information about a service
class Service {
  final String name;
  final String description;
  final DateTime createdAt;

  /// Constructor of the service class
  const Service({
    required this.name,
    required this.description,
    required this.createdAt,
  });

  /// Convert a json map into the class
  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      name: json['service']['name'],
      description: json['service']['description'],
      createdAt: json["service"]["createdAt"],
    );
  }
}
