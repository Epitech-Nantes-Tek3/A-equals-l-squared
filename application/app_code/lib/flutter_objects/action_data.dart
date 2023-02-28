import 'package:application/flutter_objects/parameter_data.dart';
import 'package:flutter/material.dart';

import 'dynamic_parameter_data.dart';

/// This class is the action class.
/// It contains all information about an action
class ActionData {
  String id;
  String name;
  String description;
  DateTime createdAt;
  bool isEnable;
  String serviceId;
  List<ParameterData> parameters;
  List<ParameterContent> parametersContent;
  List<DynamicParameterData> dynamicParameters;

  /// Constructor of the action class
  ActionData(
      {required this.id,
      required this.name,
      required this.description,
      required this.createdAt,
      required this.isEnable,
      required this.serviceId,
      required this.parameters,
      required this.parametersContent,
      required this.dynamicParameters});

  /// Utility function used for cloning the class
  ActionData.clone(ActionData oldAction)
      : this(
            id: oldAction.id,
            name: oldAction.name,
            description: oldAction.description,
            createdAt: oldAction.createdAt,
            isEnable: oldAction.isEnable,
            serviceId: oldAction.serviceId,
            parameters: oldAction.parameters
                .map((v) => ParameterData.clone(v))
                .toList(),
            parametersContent: oldAction.parametersContent
                .map((v) => ParameterContent.clone(v))
                .toList(),
            dynamicParameters: oldAction.dynamicParameters
                .map((v) => DynamicParameterData.clone(v))
                .toList());

  /// Convert a json map into the class
  factory ActionData.fromJson(Map<String, dynamic> json) {
    List<ParameterData> parameters = <ParameterData>[];
    for (var temp in json['Parameters']) {
      parameters.add(ParameterData.fromJson(temp));
    }
    List<DynamicParameterData> dynamicParameters = <DynamicParameterData>[];
    for (var temp in json['DynamicParameters']) {
      dynamicParameters.add(DynamicParameterData.fromJson(temp));
    }
    return ActionData(
        id: json['id'],
        name: json['name'],
        description: json['description'],
        createdAt: DateTime.parse(json['createdAt']),
        isEnable: json['isEnable'],
        serviceId: json['serviceId'],
        parameters: parameters,
        parametersContent: <ParameterContent>[],
        dynamicParameters: dynamicParameters);
  }

  /// Return the list of all the associated param content
  List<ParameterContent> getAllParameterContent() {
    return parametersContent;
  }

  /// Get a visual representation of an Action
  /// mode -> true = params, false = only name and desc
  /// params -> list of all the associated parameter content
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
      List<Widget> dynamicParams = <Widget>[];
      for (var temp in dynamicParameters) {
        dynamicParams.add(temp.display());
      }
      paramWid.add(Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: dynamicParams,
      ));
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: paramWid,
    );
  }

  /// Function to display the name of a Reaction
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

  /// Function to display all information about a Reaction
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
