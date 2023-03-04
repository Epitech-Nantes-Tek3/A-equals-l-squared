import 'package:application/flutter_objects/parameter_data.dart';
import 'package:application/language/language.dart';
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
  bool isDynamicParamDisplay;
  String serviceId;
  bool isPreviewDisplayMax;
  List<ParameterData> parameters;
  List<ParameterContent> parametersContent;
  List<DynamicParameterData> dynamicParameters;

  /// Constructor of the action class
  ActionData(
      {required this.id,
      required this.name,
      required this.isDynamicParamDisplay,
      required this.description,
      required this.createdAt,
      required this.isEnable,
      required this.serviceId,
      required this.isPreviewDisplayMax,
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
            isPreviewDisplayMax: true,
            isDynamicParamDisplay: false,
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
        isPreviewDisplayMax: true,
        isDynamicParamDisplay: false,
        parametersContent: <ParameterContent>[],
        dynamicParameters: dynamicParameters);
  }

  /// Return the list of all the associated param content
  List<ParameterContent> getAllParameterContent() {
    return parametersContent;
  }

  /// This function display the view of actions modification
  Widget displayActionModificationView(Function? update, BuildContext context) {
    List<Widget> actionPreview = <Widget>[];

    actionPreview.add(Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            displayActionDescription(context),
            IconButton(
                onPressed: () {
                  if (isPreviewDisplayMax) {
                    isPreviewDisplayMax = false;
                  } else {
                    isPreviewDisplayMax = true;
                  }
                  update!(null);
                },
                icon: isPreviewDisplayMax
                    ? const Icon(Icons.expand_circle_down_outlined)
                    : const Icon(Icons.arrow_circle_up_outlined))
          ],
        )
      ],
    ));

    if (isPreviewDisplayMax) {
      ParameterData? previous;
      for (var temp in parameters) {
        actionPreview.add(temp.display(parametersContent, previous, update!));
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
      actionPreview.add(Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(getSentence('ACT-01'), style: const TextStyle(fontSize: 12)),
              IconButton(
                  onPressed: () {
                    if (isDynamicParamDisplay) {
                      isDynamicParamDisplay = false;
                    } else {
                      isDynamicParamDisplay = true;
                    }
                    update!(null);
                  },
                  icon: isDynamicParamDisplay
                      ? const Icon(Icons.info)
                      : const Icon(Icons.info_outline))
            ],
          ),
          if (isDynamicParamDisplay)
            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: dynamicParams,
            ),
        ],
      ));
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: actionPreview,
    );
  }

  /// Function to display the name of an Action
  Widget? displayActionName() {
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

  /// Function to display description information about an Action
  Widget displayActionDescription(BuildContext context) {
    List<Widget> actionDescription = <Widget>[];
    actionDescription.add(
      Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            Text(
              description,
              style: TextStyle(color: Theme.of(context).secondaryHeaderColor),
            ),
          ]),
    );
    return Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: actionDescription);
  }
}
