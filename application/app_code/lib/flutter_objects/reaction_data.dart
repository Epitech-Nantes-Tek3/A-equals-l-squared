import 'package:application/flutter_objects/parameter_data.dart';
import 'package:flutter/material.dart';

/// This class is the reaction class.
/// It contains all information about a reaction
class ReactionData {
  String id;
  String name;
  String description;
  DateTime createdAt;
  bool isEnable;
  String serviceId;
  List<ParameterData> parameters;
  List<ParameterContent> parametersContent;

  /// Constructor of the reaction class
  ReactionData(
      {required this.id,
      required this.name,
      required this.description,
      required this.createdAt,
      required this.isEnable,
      required this.serviceId,
      required this.parameters,
      required this.parametersContent});

  /// Utility function used for cloning the class
  ReactionData.clone(ReactionData oldReaction)
      : this(
            id: oldReaction.id,
            name: oldReaction.name,
            description: oldReaction.description,
            createdAt: oldReaction.createdAt,
            isEnable: oldReaction.isEnable,
            serviceId: oldReaction.serviceId,
            parameters: oldReaction.parameters
                .map((v) => ParameterData.clone(v))
                .toList(),
            parametersContent: oldReaction.parametersContent
                .map((v) => ParameterContent.clone(v))
                .toList());

  /// Convert a json map into the class
  factory ReactionData.fromJson(Map<String, dynamic> json) {
    List<ParameterData> parameters = <ParameterData>[];
    for (var temp in json['Parameters']) {
      parameters.add(ParameterData.fromJson(temp));
    }
    return ReactionData(
        id: json['id'],
        name: json['name'],
        description: json['description'],
        createdAt: DateTime.parse(json['createdAt']),
        isEnable: json['isEnable'],
        serviceId: json['serviceId'],
        parameters: parameters,
        parametersContent: <ParameterContent>[]);
  }

  /// Return the list of all the associated param content
  List<ParameterContent> getAllParameterContent() {
    return parametersContent;
  }

  /// Get a visual representation of a Reaction
  /// mode -> true = params, false = only text and desc
  /// update -> Function pointer used for update the state
  Widget display(bool mode, Function? update) {
    List<Widget> paramWid = <Widget>[];
    paramWid.add(Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(
                      description,
                      style: TextStyle(
                          color: isEnable ? Colors.green : Colors.red),
                    ), // Change when icon are in DB
                  ]),
            ],
          ),
        ]));
    if (mode == true) {
      ParameterData? previous;
      for (var temp in parameters) {
        paramWid.add(temp.display(parametersContent, previous, update!));
        if (temp.isRequired == true && temp.getterUrl != null) {
          previous = temp;
        } else {
          previous = null;
        }
      }
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: paramWid,
    );
  }

  /// Function to display reaction name
  Widget? displayReactionName() {
    if (isEnable) {
      return Column(
        children: <Widget>[
          Text(name),
        ],
      );
    } else {
      return null;
    }
  }

  /// Function to display reaction description
  Widget? displayReactionDescription() {
    if (isEnable) {
      return Column(
        children: <Widget>[
          Text(description),
        ],
      );
    } else {
      return null;
    }
  }

  /// Function to display all reaction information
  Widget? displayReactionWithInfo() {
    if (isEnable) {
      return Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              Row(
                children: <Widget>[
                  const Icon(Icons.access_alarm),
                  Text(name),
                ],
              ),
            ],
          ),
          Row(children: <Widget>[
            Text(description),
          ]),
        ],
      );
    } else {
      return null;
    }
  }
}
