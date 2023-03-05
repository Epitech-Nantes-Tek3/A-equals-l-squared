import 'package:application/flutter_objects/parameter_data.dart';
import 'package:application/flutter_objects/reaction_data.dart';
import 'package:application/flutter_objects/service_data.dart';
import 'package:application/language/language.dart';
import 'package:application/pages/home/home_functional.dart';
import 'package:flutter/material.dart';

import 'action_data.dart';

/// This class is the Area class.
/// It contains all information about an Area
class AreaData {
  String id;
  String name;
  String userId;
  List<ActionData> actionList;
  List<ReactionData> reactionList;
  DateTime updatedAt;
  bool isEnable = true;
  String primaryColor;
  String secondaryColor;
  String iconPath;
  String? description;
  ServiceData? serviceId;
  String logicalGate;

  /// Constructor of the Area class
  AreaData({
    required this.id,
    required this.name,
    required this.userId,
    required this.actionList,
    required this.reactionList,
    required this.updatedAt,
    required this.isEnable,
    required this.logicalGate,
    required this.primaryColor,
    required this.secondaryColor,
    required this.iconPath,
    this.description,
    this.serviceId,
  });

  /// Utility function used for cloning the class
  AreaData.clone(AreaData oldArea)
      : this(
            id: oldArea.id,
            name: oldArea.name,
            userId: oldArea.userId,
            actionList:
                oldArea.actionList.map((v) => ActionData.clone(v)).toList(),
            reactionList:
                oldArea.reactionList.map((v) => ReactionData.clone(v)).toList(),
            isEnable: oldArea.isEnable,
            description: oldArea.description,
            serviceId: oldArea.serviceId,
            logicalGate: oldArea.logicalGate,
            primaryColor: oldArea.primaryColor,
            secondaryColor: oldArea.secondaryColor,
            iconPath: oldArea.iconPath,
            updatedAt: oldArea.updatedAt);

  /// Convert a json map into the class
  factory AreaData.fromJson(Map<String, dynamic> json) {
    List<ActionData> actionList = <ActionData>[];
    List<ReactionData> reactionList = <ReactionData>[];
    try {
      for (var temp in json['Actions']) {
        actionList.add(getActionDataById(temp['Action']['id'])!);
        actionList.last.id = temp['id'];
        for (var temp2 in temp['ActionParameters']) {
          actionList.last.parametersContent
              .add(ParameterContent.fromJson(temp2));
          try {
            actionList.last.parametersContent.last.id = temp2['id'];
          } catch (err) {
            debugPrint(err.toString());
          }
        }
      }
      for (var temp in json['Reactions']) {
        reactionList.add(getReactionDataById(temp['Reaction']['id'])!);
        reactionList.last.id = temp['id'];
        for (var temp2 in temp['ReactionParameters']) {
          reactionList.last.parametersContent
              .add(ParameterContent.fromJson(temp2));
          try {
            reactionList.last.parametersContent.last.id = temp2['id'];
          } catch (err) {
            debugPrint(err.toString());
          }
        }
      }
    } catch (err) {
      err;
    }
    return AreaData(
        id: json['id'],
        name: json['name'],
        userId: '',
        actionList: actionList,
        reactionList: reactionList,
        isEnable: json['isEnable'],
        description: json['description'],
        logicalGate: json['logicalGate'],
        primaryColor: json['primaryColor'],
        secondaryColor: json['secondaryColor'],
        iconPath: json['icon'],
        updatedAt: DateTime.parse(json['updatedAt']));
  }

  /// Get the first color of hit first service
  Color getPrimaryColor() {
    String str = primaryColor.replaceFirst("#", "0xff");
    Color tempColor = Color(int.parse(str));
    return tempColor;
  }

  /// Get the secondary color of hit first service
  Color getSecondaryColor() {
    String str = secondaryColor.replaceFirst("#", "0xff");
    Color tempColor = Color(int.parse(str));
    return tempColor;
  }

  /// This function return the good icon with the serviceName
  Widget getServiceIcon() {
    return Column(
      children: <Widget>[
        Image.asset(
          iconPath != '' ? iconPath : 'assets/icons/Area_Logo.png',
          height: 50,
          width: 50,
        )
      ],
    );
  }

  /// This function display an Area preview with the logo, the name and the description
  Widget displayAreaPreview(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            getServiceIcon(),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                name,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: Theme.of(context).secondaryHeaderColor),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        Text(
          description == null
              ? '${getSentence("AREA-01")}${getSentence("AREA-02")}'
              : '${getSentence("AREA-01")}$description',
          overflow: TextOverflow.ellipsis,
          style: TextStyle(color: Theme.of(context).secondaryHeaderColor),
        )
      ],
    );
  }

  /// Get a visual representation of an Area
  /// mode -> true = complete representation, false = only area preview
  /// update -> Function pointer used for update the state
  Widget display(bool mode, Function? update, bool isReactionPreviewClosed,
      bool isActionPreviewClosed, BuildContext context) {
    List<Widget> listDisplay = <Widget>[];
    List<Widget> actionListDisplay = <Widget>[Text(getSentence('AREA-03'))];
    List<Widget> reactionListDisplay = <Widget>[Text(getSentence('AREA-04'))];
    if (mode) {
      for (var temp in actionList) {
        actionListDisplay
            .add(temp.displayActionModificationView(update, context));
      }
      for (var temp in reactionList) {
        reactionListDisplay
            .add(temp.displayReactionModificationView(update, context));
      }
      listDisplay.add(Column(
        children: <Widget>[
          Row(children: <Widget>[
            Text(
              (isEnable
                  ? '${getSentence('AREA-05-01')}$name${getSentence('AREA-05-02')}'
                  : '${getSentence('AREA-05-01')}$name${getSentence('AREA-05-03')}'),
              style: TextStyle(
                  color: isEnable ? Colors.green : Colors.red, fontSize: 20),
            ),
          ]),
          const SizedBox(
            height: 10,
          ),
          (Column(children: <Widget>[
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              child: Column(children: actionListDisplay),
            )
          ])),
          const SizedBox(
            height: 20,
          ),
          (Column(children: <Widget>[
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              child: Column(children: reactionListDisplay),
            )
          ])),
        ],
      ));
    } else {
      try {
        listDisplay.add(displayAreaPreview(context));
      } catch (err) {
        listDisplay.add(Text(getSentence('AREA-06')));
      }
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: listDisplay,
    );
  }

  /// Function to display area name
  Widget? displayAreaName() {
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

  /// Function to display area description
  Widget? displayAreaDescription() {
    if (isEnable) {
      return Column(
        children: <Widget>[
          Text(description != null ? description! : getSentence('AREA-07')),
        ],
      );
    } else {
      return null;
    }
  }

  bool changeIfIsEnable() {
    if (isEnable) {
      return false;
    } else {
      return true;
    }
  }
}

/// Find an action by her id
ActionData? getActionDataById(action) {
  for (var temp in serviceDataList) {
    for (var actions in temp.actions) {
      if (actions.id == action) {
        return ActionData.clone(actions);
      }
    }
  }
  return null;
}

/// Find a reaction by her id
ReactionData? getReactionDataById(reaction) {
  for (var temp in serviceDataList) {
    for (var reactions in temp.reactions) {
      if (reactions.id == reaction) {
        return ReactionData.clone(reactions);
      }
    }
  }
  return null;
}
