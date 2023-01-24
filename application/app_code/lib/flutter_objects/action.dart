/// This class is the action class.
/// It contains all information about a action
class Action {
  final String name;
  final String description;
  final DateTime createdAt;
  final bool isEnable;

  /// Constructor of the action class
  const Action({
    required this.name,
    required this.description,
    required this.createdAt,
    required this.isEnable,
  });

  /// Convert a json map into the class
  factory Action.fromJson(Map<String, dynamic> json) {
    return Action(
      name: json['action']['name'],
      description: json['action']['description'],
      createdAt: json["action"]["createdAt"],
      isEnable: json["action"]["isEnable"]
    );
  }
}