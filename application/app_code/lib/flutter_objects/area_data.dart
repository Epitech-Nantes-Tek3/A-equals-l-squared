import 'package:application/flutter_objects/parameter_data.dart';

/// This class is the reaction class.
/// It contains all information about a reaction
class AreaData {
  String id;
  String userId;
  String actionId;
  String reactionId;
  List<ParameterContent> actionParameter;
  List<ParameterContent> reactionParameter;

  /// Constructor of the reaction class
  AreaData({
    required this.id,
    required this.userId,
    required this.actionId,
    required this.reactionId,
    required this.actionParameter,
    required this.reactionParameter,
  });

  /// Convert a json map into the class
  factory AreaData.fromJson(Map<String, dynamic> json) {
    List<ParameterContent> actionParameters = <ParameterContent>[];
    for (var temp in json['actionParameters']) {
      actionParameters.add(ParameterContent.fromJson(temp));
    }
    List<ParameterContent> reactionParameters = <ParameterContent>[];
    for (var temp in json['reactionParameters']) {
      reactionParameters.add(ParameterContent.fromJson(temp));
    }
    return AreaData(
        id: json['id'],
        userId: json['userId'],
        actionId: json['actionId'],
        reactionId: json['reactionId'],
        actionParameter: actionParameters,
        reactionParameter: reactionParameters);
  }
}
