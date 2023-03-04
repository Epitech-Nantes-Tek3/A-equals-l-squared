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
  String icon;
  List<ActionData> actions;
  List<ReactionData> reactions;
  String primaryColor;
  String secondaryColor;

  /// Constructor of the service class
  ServiceData(
      {required this.name,
      required this.id,
      required this.description,
      required this.createdAt,
      required this.isEnabled,
      required this.actions,
      required this.reactions,
      required this.primaryColor,
      required this.icon,
      required this.secondaryColor});

  /// Utility function used for cloning the class
  ServiceData.clone(ServiceData oldService)
      : this(
            name: oldService.name,
            id: oldService.id,
            icon: oldService.icon,
            description: oldService.description,
            createdAt: oldService.createdAt,
            isEnabled: oldService.isEnabled,
            primaryColor: oldService.primaryColor,
            secondaryColor: oldService.secondaryColor,
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
        icon: json['icon'],
        actions: actions,
        primaryColor: json['primaryColor'],
        secondaryColor: json['secondaryColor'],
        reactions: reactions);
  }

  /// Get a visual representation of a service
  Widget display(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Image.asset(
              icon != '' ? icon : './assets/icons/Area_Logo.png',
              height: 30,
              width: 30,
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
                    style: TextStyle(
                        color: Color(
                            int.parse(primaryColor.replaceFirst("#", "0xff")))),
                  ),
                  Text(
                    description,
                    style: TextStyle(
                        color: Theme.of(context).secondaryHeaderColor),
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
}
