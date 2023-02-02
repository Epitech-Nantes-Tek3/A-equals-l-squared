/// This class is the parameter class.
/// It contains all information about a parameter
class ParameterData {
  String id;
  String name;
  String displayName;
  String description;
  String? actionId;
  String? reactionId;

  /// Constructor of the reaction class
  ParameterData(
      {required this.id,
      required this.name,
      required this.displayName,
      required this.description,
      this.actionId,
      this.reactionId});

  /// Convert a json map into the class
  factory ParameterData.fromJson(Map<String, dynamic> json) {
    late String? actionId;
    try {
      actionId = json['actionId'];
    } catch (err) {
      actionId = null;
    }
    late String? reactionId;
    try {
      reactionId = json['reactionId'];
    } catch (err) {
      reactionId = null;
    }
    return ParameterData(
        id: json['id'],
        name: json['name'],
        displayName: json['displayName'],
        description: json['description'],
        actionId: actionId,
        reactionId: reactionId);
  }
}

/// This class is the ParameterContent class.
/// It contains the value of a parameter content.
class ParameterContent {
  String paramId;
  String content;

  /// Constructor of the parameterContent class
  ParameterContent({required this.paramId, required this.content});

  /// Convert a json map into the class
  factory ParameterContent.fromJson(Map<String, dynamic> json) {
    return ParameterContent(
      paramId: json['paramId'],
      content: json['value'],
    );
  }
}
