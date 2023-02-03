import 'package:application/flutter_objects/parameter_data.dart';
import 'package:application/flutter_objects/reaction_data.dart';
import 'package:application/pages/home/home_functional.dart';
import 'package:flutter/material.dart';

import 'action_data.dart';

/// This class is the Area class.
/// It contains all information about an Area
class AreaData {
  String id;
  String name;
  String userId;
  String actionId;
  String reactionId;
  bool isEnable;
  List<ParameterContent> actionParameters;
  List<ParameterContent> reactionParameters;

  /// Constructor of the Area class
  AreaData({
    required this.id,
    required this.name,
    required this.userId,
    required this.actionId,
    required this.reactionId,
    required this.isEnable,
    required this.actionParameters,
    required this.reactionParameters,
  });

  /// Convert a json map into the class
  factory AreaData.fromJson(Map<String, dynamic> json) {
    List<ParameterContent> actionParameters = <ParameterContent>[];
    for (var temp in json['ActionParameters']) {
      actionParameters.add(ParameterContent.fromJson(temp));
    }
    List<ParameterContent> reactionParameters = <ParameterContent>[];
    for (var temp in json['ReactionParameters']) {
      reactionParameters.add(ParameterContent.fromJson(temp));
    }
    return AreaData(
        id: json['id'],
        name: json['name'],
        userId: json['userId'],
        actionId: json['actionId'],
        reactionId: json['reactionId'],
        isEnable: json['isEnable'],
        actionParameters: actionParameters,
        reactionParameters: reactionParameters);
  }

  /// Get a visual representation of an Area
  /// mode -> true = complete representation, false = only area preview
  Widget display(bool mode) {
    late ActionData action;
    late ReactionData reaction;

    for (var temp in serviceDataList) {
      for (var tempAct in temp.actions) {
        if (tempAct.id == actionId) {
          action = tempAct;
          break;
        }
      }
    }
    for (var temp in serviceDataList) {
      for (var tempReact in temp.reactions) {
        if (tempReact.id == reactionId) {
          reaction = tempReact;
          break;
        }
      }
    }
    List<Widget> listDisplay = <Widget>[];
    if (mode) {
      listDisplay.add(Text(
        name,
        style: TextStyle(color: isEnable ? Colors.green : Colors.red),
      ));
      listDisplay.add(const Text("Action"));
      listDisplay.add(action.display(true, actionParameters));
      listDisplay.add(const Text("Reaction"));
      listDisplay.add(reaction.display(true, reactionParameters));
    } else {
      try {
        listDisplay.add(Text(name));
        listDisplay.add(Text(action.name));
        listDisplay.add(Text(reaction.name));
      } catch(err) {
        listDisplay.add(const Text("Please logout and login."));
      }
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: listDisplay,
    );
  }
}
