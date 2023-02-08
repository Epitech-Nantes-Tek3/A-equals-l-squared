import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../network/informations.dart';

/// This class is the parameter class.
/// It contains all information about a parameter
class ParameterData {
  String id;
  String name;
  String description;
  bool isRequired;
  String? getterUrl;
  String? actionId;
  String? reactionId;
  ParameterContent? matchedContent;
  ParameterData? previous;

  /// Constructor of the reaction class
  ParameterData({
    required this.id,
    required this.name,
    required this.description,
    required this.isRequired,
    this.getterUrl,
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
    late String? getterUrl;
    try {
      getterUrl = json['getterUrl'];
    } catch (err) {
      getterUrl = null;
    }
    return ParameterData(
        id: json['id'],
        name: json['name'],
        description: json['description'],
        isRequired: json['isRequired'],
        getterUrl: getterUrl,
        actionId: actionId,
        reactionId: reactionId);
  }

  /// Function returning a visual representation of a parameter
  /// params -> list of all the associated parameter content
  /// previous -> Previous displayed parameter
  Widget display(List<ParameterContent> params, ParameterData? previous) {
    this.previous = previous;
    for (var tempParam in params) {
      if (tempParam.paramId == id) {
        matchedContent ??= tempParam;
        break;
      }
    }
    matchedContent ??= ParameterContent(paramId: id, value: "");
    return Column(children: <Widget>[
      const SizedBox(
        height: 10,
      ),
      TextFormField(
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
            if (value == null && isRequired) {
              return 'Required parameter.';
            }
            value ??= "";
            if (matchedContent != null) matchedContent!.value = value;
            return null;
          })
    ]);
  }

  /// Function asking the server for Proposal value related to this parameter
  /// Is no getterUrl is set, the function is not run
  Future<void> getProposalValue() async {
    if (getterUrl == null) {
      return;
    }
    String? idValue;
    if (previous != null && previous!.matchedContent != null) {
      idValue = previous!.matchedContent!.value;

      /// UPDATE TO MAP
    }
    final response = await http.get(
      Uri.parse('http://$serverIp:8080$getterUrl?id=${idValue!}'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
    );

    try {
      if (response.statusCode == 200) {
        /// FILL THE MAP
        return;
      } else {
        return;
      }
    } catch (err) {
      return;
    }
  }
}

/// This class is the ParameterContent class.
/// It contains the value of a parameter content.
class ParameterContent {
  String paramId;
  String value;

  /// Constructor of the parameterContent class
  ParameterContent({required this.paramId, required this.value});

  /// Convert a json map into the class
  factory ParameterContent.fromJson(Map<String, dynamic> json) {
    return ParameterContent(paramId: json['parameterId'], value: json['value']);
  }
}
