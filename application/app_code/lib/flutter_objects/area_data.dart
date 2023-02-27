import 'package:application/flutter_objects/parameter_data.dart';
import 'package:application/flutter_objects/reaction_data.dart';
import 'package:application/flutter_objects/service_data.dart';
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
  bool isEnable = true;
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
    required this.isEnable,
    required this.logicalGate,
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
            logicalGate: oldArea.logicalGate);

  /// Convert a json map into the class
  factory AreaData.fromJson(Map<String, dynamic> json) {
    List<ActionData> actionList = <ActionData>[];
    for (var temp in json['Actions']) {
      actionList.add(getActionDataById(temp['Action']['id'])!);
      actionList.last.id = temp['id'];
      for (var temp2 in temp['ActionParameters']) {
        actionList.last.parametersContent.add(ParameterContent.fromJson(temp2));
        try {
          actionList.last.parametersContent.last.id = temp2['id'];
        } catch (err) {
          debugPrint(err.toString());
        }
      }
    }
    List<ReactionData> reactionList = <ReactionData>[];
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
    return AreaData(
        id: json['id'],
        name: json['name'],
        userId: '',
        actionList: actionList,
        reactionList: reactionList,
        isEnable: json['isEnable'],
        description: json['description'],
        logicalGate: json['logicalGate']);
  }

  /// Get the first color of hit first service
  Color getPrimaryColor() {
    if (getAssociatedService() == null) {
      return Colors.white;
    }
    String str = getAssociatedService()!.primaryColor.replaceFirst("#", "0xff");
    Color tempColor = Color(int.parse(str));
    return tempColor;
  }

  /// Get the secondary color of hit first service
  Color getSecondaryColor() {
    if (getAssociatedService() == null) {
      return Colors.white;
    }
    String str =
        getAssociatedService()!.secondaryColor.replaceFirst("#", "0xff");
    Color tempColor = Color(int.parse(str));
    return tempColor;
  }

  /// This function return the first associated service of an Area
  ServiceData? getAssociatedService() {
    if (actionList.isEmpty) {
      return null;
    }
    for (var temp in serviceDataList) {
      if (temp.id == actionList[0].serviceId) {
        return temp;
      }
    }
    return null;
  }

  /// This function return the good icon with the serviceName
  Widget getServiceIcon() {
    ServiceData? serviceData = getAssociatedService();
    return Column(
      children: <Widget>[
        Image.asset(
          serviceData != null
              ? (serviceData.icon != ''
                  ? serviceData.icon
                  : 'assets/icons/Area_Logo.png')
              : 'assets/icons/Area_Logo.png',
          height: 50,
          width: 50,
        )
      ],
    );
  }

  /// This function display an Area preview with the logo, the name and the description
  Widget displayAreaPreview() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            getServiceIcon(),
            Text(
              name,
              style: const TextStyle(color: Colors.black),
            ),
          ],
        ),
        const SizedBox(height: 20),
        Text(
          'Description : \n\n $description',
          style: const TextStyle(color: Colors.black),
        )

        /// Put Description when it's in DB
      ],
    );
  }

  /// Get a visual representation of an Area
  /// mode -> true = complete representation, false = only area preview
  /// update -> Function pointer used for update the state
  Widget display(bool mode, Function? update) {
    List<Widget> listDisplay = <Widget>[];
    List<Widget> actionListDisplay = <Widget>[const Text("Actions")];
    List<Widget> reactionListDisplay = <Widget>[const Text("Reactions")];
    if (mode) {
      for (var temp in actionList) {
        actionListDisplay.add(
          temp.display(true, update),
        );
      }
      for (var temp in reactionList) {
        reactionListDisplay.add(
          temp.display(true, update),
        );
      }
      listDisplay.add(Column(
        children: <Widget>[
          Row(children: <Widget>[
            Text(
              (isEnable
                  ? 'Area : $name is activated'
                  : 'Area : $name is disabled'),
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
        listDisplay.add(displayAreaPreview());
      } catch (err) {
        listDisplay.add(const Text("Please logout and login."));
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
      /// Add ' && description != null ' when is in DB
      return Column(
        children: <Widget>[
          Text(description != null ? description! : 'No description'),
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
