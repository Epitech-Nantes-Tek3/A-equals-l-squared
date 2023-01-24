/// This class is the reaction class.
/// It contains all information about a reaction
class ReactionData {
  final String name;
  final String description;
  final DateTime createdAt;
  final bool isEnable;

  /// Constructor of the reaction class
  const ReactionData({
    required this.name,
    required this.description,
    required this.createdAt,
    required this.isEnable,
  });

  /// Convert a json map into the class
  factory ReactionData.fromJson(Map<String, dynamic> json) {
    return ReactionData(
        name: json['reaction']['name'],
        description: json['reaction']['description'],
        createdAt: json["reaction"]["createdAt"],
        isEnable: json["reaction"]["isEnable"]);
  }
}
