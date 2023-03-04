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
  bool isPreviewDisplayMax;
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
      required this.isPreviewDisplayMax,
      required this.parameters,
      required this.parametersContent});

  /// Utility function used for cloning the class
  ReactionData.clone(ReactionData oldReaction)
      : this(
            id: oldReaction.id,
            name: oldReaction.name,
            description: oldReaction.description,
            createdAt: oldReaction.createdAt,
            isPreviewDisplayMax: true,
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
        isPreviewDisplayMax: true,
        parametersContent: <ParameterContent>[]);
  }

  /// Return the list of all the associated param content
  List<ParameterContent> getAllParameterContent() {
    return parametersContent;
  }

  /// Get a visual representation of a Reaction
  /// update -> Function pointer used for update the state
  Widget displayReactionModificationView(
      Function? update, BuildContext context) {
    List<Widget> paramWid = <Widget>[];

    paramWid.add(Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            displayReactionDescription(context),
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

  /// This function display the description of Reaction
  Widget displayReactionDescription(BuildContext context) {
    List<Widget> paramWid = <Widget>[];
    paramWid.add(
      Column(crossAxisAlignment: CrossAxisAlignment.center, children: <Widget>[
        Text(
          description,
          style: TextStyle(
              fontSize: 14, color: Theme.of(context).secondaryHeaderColor),
        ),
      ]),
    );
    return Column(
        crossAxisAlignment: CrossAxisAlignment.center, children: paramWid);
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
