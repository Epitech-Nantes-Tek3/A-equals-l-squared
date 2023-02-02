import 'package:application/flutter_objects/parameter_data.dart';
import 'package:application/flutter_objects/reaction_data.dart';
import 'package:application/pages/home/home_functional.dart';
import 'package:flutter/material.dart';

import 'action_data.dart';

/// This class is the Area class.
/// It contains all information about an Area
class AreaData {
  String id;
  String userId;
  String actionId;
  String reactionId;
  List<ParameterContent> actionParameter;
  List<ParameterContent> reactionParameter;

  /// Constructor of the Area class
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

  /// Get a visual representation of an Area
  Widget display() {
    late ActionData action;
    late ReactionData reaction;

    for (var temp in serviceDataList) {
      for (var tempAct in temp.actions) {
        if (tempAct.id == actionId) {
          action = tempAct;
          break;
        }
      }
      for (var tempReact in temp.reactions) {
        if (tempReact.id == actionId) {
          reaction = tempReact;
          break;
        }
      }
    }
    List<Widget> listDisplay = <Widget>[];
    listDisplay.add(const Text("Area"));
    listDisplay.add(const Text("Action"));
    listDisplay.add(action.display());
    listDisplay.add(const Text("Reaction"));
    listDisplay.add(reaction.display());
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: listDisplay,
    );
  }
}
