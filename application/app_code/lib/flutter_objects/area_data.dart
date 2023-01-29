import 'package:flutter/material.dart';

/// This class is the AreaData class.
/// It contains all information about an AreaData
class AreaData {
  String areaName;
  String? description;
  bool isEnable;
  String actionId;
  String reactionId;
  DateTime createdAt;

  /// Constructor of the AreaData class
  AreaData({
    required this.areaName,
    required this.isEnable,
    required this.createdAt,
    required this.actionId,
    required this.reactionId,
    this.description,
  });

  /// Convert a json map into the class
  factory AreaData.fromJson(Map<String, dynamic> json) {
    return AreaData(
        areaName: json['userhasactionsreactions']['name'],
        isEnable: json['userhasactionsreactions']['isEnable'],
        createdAt: DateTime.parse(json['userhasactionsreactions']['createdAt']),
        actionId: json['userhasactionsreactions']['actionId'],
        reactionId: json['userhasactionsreactions']['reactionId']);
  }

  /// Function to display area name
  Widget? displayAreaName() {
    if (isEnable) {
      return Column(
        children: <Widget>[
          Text(areaName),
        ],
      );
    } else {
      return null;
    }
  }

  /// Function to display area description
  Widget? displayAreaDescription() {
    if (isEnable && description != null) {
      return Column(
        children: <Widget>[
          Text(description!),
        ],
      );
    } else {
      return null;
    }
  }
}
