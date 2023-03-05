import 'dart:convert';

import 'package:application/language/language.dart';
import 'package:application/pages/home/home_functional.dart';
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
  Map<String, String>? getterValue;
  bool needToUpdate = true;

  /// Constructor of the parameterData class
  ParameterData({
    required this.id,
    required this.name,
    required this.description,
    required this.isRequired,
    this.getterUrl,
    this.actionId,
    this.reactionId,
  });

  /// Utility function used for cloning the class
  ParameterData.clone(ParameterData oldParameter)
      : this(
            name: oldParameter.name,
            id: oldParameter.id,
            description: oldParameter.description,
            isRequired: oldParameter.isRequired,
            getterUrl: oldParameter.getterUrl,
            actionId: oldParameter.actionId,
            reactionId: oldParameter.reactionId);

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
      getterUrl = json['GetterUrl'];
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
  Widget display(
      List<ParameterContent> params, ParameterData? previous, Function update) {
    this.previous = previous;
    for (var tempParam in params) {
      if (tempParam.paramId == id) {
        matchedContent = tempParam;
        break;
      }
    }
    matchedContent ??= ParameterContent(paramId: id, value: "", id: '');
    List<String>? tempProposal;

    if (getterUrl != null) {
      if (needToUpdate == true) {
        needToUpdate = false;
        update(this);
      }
      tempProposal = <String>["Click To Update"];
      if (getterValue != null) {
        for (var temp in getterValue!.keys) {
          tempProposal.add(temp);
        }
      }
      if (matchedContent!.value == "") {
        matchedContent!.value = "Click To Update";
      } else if (!tempProposal.contains(matchedContent!.value)) {
        if (getterValue != null &&
            getterValue!.containsValue(matchedContent!.value)) {
          matchedContent!.value = getterValue!.keys.firstWhere(
              (k) => getterValue![k] == matchedContent!.value,
              orElse: () => matchedContent!.value);
        } else {
          tempProposal.add(matchedContent!.value);
        }
      }
    }
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: <
        Widget>[
      const SizedBox(
        height: 20,
      ),
      Row(
        children: [
          Text(
              isRequired
                  ? '$description${getSentence('PARAM-01-01')}'
                  : '$description${getSentence('PARAM-01-02')}',
              style: const TextStyle(fontSize: 12)),
        ],
      ),
      const SizedBox(
        height: 10,
      ),
      if (getterUrl == null)
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
      else
        Row(children: [
          DropdownButtonHideUnderline(
              child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10.0),
              border: Border.all(style: BorderStyle.solid, width: 0.80),
            ),
            child: DropdownButton<String>(
              icon: const Icon(Icons.keyboard_arrow_down),
              value: matchedContent!.value,
              elevation: 45,
              onChanged: (String? value) {
                if (value == null && isRequired) {
                  return;
                }
                value ??= "";
                if (matchedContent != null) matchedContent!.value = value;
                update(this);
              },
              items:
                  tempProposal!.map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
          ))
        ])
    ]);
  }

  /// Function asking the server for Proposal value related to this parameter
  /// Is no getterUrl is set, the function is not run
  Future<void> getProposalValue() async {
    if (getterUrl == null) {
      return;
    }
    String idValue = '';
    if (previous != null) {
      if (previous!.getterValue == null) {
        needToUpdate = true;
        return;
      }
    }

    if (previous != null &&
        previous!.matchedContent != null &&
        previous!.getterValue != null) {
      idValue = previous!.getterValue![previous!.matchedContent!.value]!;
      if (idValue == "Click To Update") {
        needToUpdate = true;
        return;
      }
    }
    final response = await http.get(
      Uri.parse('http://$serverIp:8080$getterUrl?id=$idValue'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
    );

    try {
      if (response.statusCode == 200) {
        var decoded = jsonDecode(response.body)['data'];
        getterValue = {};
        for (var temp in decoded) {
          getterValue![temp["name"]] = temp["id"];
        }
        if (matchedContent != null &&
            getterValue!.containsValue(matchedContent!.value)) {
          var key = getterValue!.keys.firstWhere(
              (k) => getterValue![k] == matchedContent!.value,
              orElse: () => "");
          if (key != "") {
            matchedContent!.value = key;
          }
        }
        matchedContent!.getParameterData()!.getterValue = getterValue;
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
  String id;

  /// Constructor of the parameterContent class
  ParameterContent(
      {required this.paramId, required this.value, required this.id});

  ParameterContent.clone(ParameterContent oldParameter)
      : this(
            paramId: oldParameter.paramId,
            value: oldParameter.value,
            id: oldParameter.id);

  /// Convert a json map into the class
  factory ParameterContent.fromJson(Map<String, dynamic> json) {
    return ParameterContent(
        paramId: json['Parameter']['id'], value: json['value'], id: '');
  }

  ParameterData? getParameterData() {
    for (var temp in serviceDataList) {
      for (var temp2 in temp.reactions) {
        for (var temp3 in temp2.parameters) {
          if (temp3.id == paramId) {
            return temp3;
          }
        }
      }
      for (var temp2 in temp.actions) {
        for (var temp3 in temp2.parameters) {
          if (temp3.id == paramId) {
            return temp3;
          }
        }
      }
    }
    return null;
  }
}
