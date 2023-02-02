import 'package:application/flutter_objects/reaction_data.dart';
import 'package:flutter/material.dart';

import 'action_data.dart';

/// This class is the service class.
/// It contains all information about a service
class ServiceData {
  String name;
  String id;
  String description;
  DateTime createdAt;
  bool isEnabled;
  List<ActionData> actions;
  List<ReactionData> reactions;

  /// Constructor of the service class
  ServiceData(
      {required this.name,
      required this.id,
      required this.description,
      required this.createdAt,
      required this.isEnabled,
      required this.actions,
      required this.reactions});

  /// Convert a json map into the class
  factory ServiceData.fromJson(Map<String, dynamic> json) {
    List<ActionData> actions = <ActionData>[];
    for (var temp in json['Actions']) {
      actions.add(ActionData.fromJson(temp));
    }
    List<ReactionData> reactions = <ReactionData>[];
    for (var temp in json['Reactions']) {
      reactions.add(ReactionData.fromJson(temp));
    }
    return ServiceData(
        name: json['name'],
        description: json['description'],
        createdAt: DateTime.parse(json['createdAt']),
        isEnabled: json['isEnable'],
        id: json['id'],
        actions: actions,
        reactions: reactions);
  }

  /// Get a visual representation of a service
  Widget display() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        Text(
          name,
          style: TextStyle(color: isEnabled ? Colors.green : Colors.red),
        ),
        Text(description),
      ],
    );
  }
}
