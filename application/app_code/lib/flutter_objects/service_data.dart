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

  ServiceData.clone(ServiceData oldService)
      : this(
            name: oldService.name,
            id: oldService.id,
            description: oldService.description,
            createdAt: oldService.createdAt,
            isEnabled: oldService.isEnabled,
            actions:
                oldService.actions.map((v) => ActionData.clone(v)).toList(),
            reactions: oldService.reactions
                .map((v) => ReactionData.clone(v))
                .toList());

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
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const Icon(
              Icons.square,
              color: Colors.black,
            ),
            const SizedBox(
              width: 30,
            ),
            Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Text(
                    name,
                    style:
                        TextStyle(color: isEnabled ? Colors.green : Colors.red),
                  ),
                  // Change when icon are in DB
                  Text(
                    description,
                    style: const TextStyle(color: Colors.black),
                  ),
                ]),
          ],
        ),
      ],
    );
  }

  /// Function to display the name of a Service
  Widget displayServiceName() {
    return Column(
      children: <Widget>[
        Text(name),
      ],
    );
  }

  /// Function to display the description of a Service
  Widget displayServiceDescription() {
    return Column(
      children: <Widget>[
        Text(description),
      ],
    );
  }

  /// Function to display all information about a Service
  Widget displayServiceWithInfo() {
    return Column(
      children: <Widget>[
        Row(
          children: <Widget>[
            Row(
              children: <Widget>[
                const Icon(Icons.access_alarm),
                Text('Discord Test : $name!'),
              ],
            ),
          ],
        ),
        Row(children: <Widget>[
          Text('Discord description : $description'),
        ]),
      ],
    );
  }
}
