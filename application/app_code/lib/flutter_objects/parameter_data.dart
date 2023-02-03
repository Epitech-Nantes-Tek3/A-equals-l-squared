import 'package:flutter/material.dart';

/// This class is the parameter class.
/// It contains all information about a parameter
class ParameterData {
  String id;
  String name;
  String description;
  String? actionId;
  String? reactionId;
  ParameterContent? matchedContent;

  /// Constructor of the reaction class
  ParameterData({
    required this.id,
    required this.name,
    required this.description,
    this.actionId,
    this.reactionId,
  });

  /// Convert a json map into the class
  factory ParameterData.fromJson(Map<String, dynamic> json) {
    late String? actionId;
    try {
      actionId = json['actionId'];
    } catch (err) {
      actionId = null;
    }
    late String? reactionId;
    try {
      reactionId = json['reactionId'];
    } catch (err) {
      reactionId = null;
    }
    return ParameterData(
        id: json['id'],
        name: json['name'],
        description: json['description'],
        actionId: actionId,
        reactionId: reactionId);
  }

  /// Function returning a visual representation of a parameter
  /// params -> list of all the associated parameter content
  Widget display(List<ParameterContent> params) {
    for (var tempParam in params) {
      if (tempParam.paramId == id) {
        matchedContent ??= tempParam;
        break;
      }
    }
    matchedContent ??=
        ParameterContent(paramId: id, value: "");
    return TextFormField(
        decoration: InputDecoration(
          contentPadding: const EdgeInsets.all(20),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(5.0),
          ),
          labelText: name,
        ),
        initialValue: matchedContent != null ? matchedContent!.value : "",
        autovalidateMode: AutovalidateMode.onUserInteraction,
        validator: (String? value) {
          value ??= "";
          if (matchedContent != null) matchedContent!.value = value;
          return null;
        });
  }
}

/// This class is the ParameterContent class.
/// It contains the value of a parameter content.
class ParameterContent {
  String paramId;
  String value;

  /// Constructor of the parameterContent class
  ParameterContent(
      {required this.paramId, required this.value});

  /// Convert a json map into the class
  factory ParameterContent.fromJson(Map<String, dynamic> json) {
    return ParameterContent(
        paramId: json['parameterId'],
        value: json['value']);
  }
}
