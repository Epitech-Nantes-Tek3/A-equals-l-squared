/// This class is the action class.
/// It contains all information about an action
class ActionData {
  String name;
  String description;
  DateTime createdAt;
  bool isEnable;

  /// Constructor of the action class
  ActionData({
    required this.name,
    required this.description,
    required this.createdAt,
    required this.isEnable,
  });

  /// Convert a json map into the class
  factory ActionData.fromJson(Map<String, dynamic> json) {
    return ActionData(
        name: json['action']['name'],
        description: json['action']['description'],
        createdAt: DateTime.parse(json['action']['createdAt']),
        isEnable: json['action']['isEnable']);
  }
}
