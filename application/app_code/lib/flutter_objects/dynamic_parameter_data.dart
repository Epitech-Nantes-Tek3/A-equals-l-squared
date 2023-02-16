import 'package:flutter/material.dart';

class DynamicParameterData {
  String id;
  String name;
  String description;

  DynamicParameterData(
      {required this.id, required this.name, required this.description});

  DynamicParameterData.clone(DynamicParameterData oldParameter)
      : this(
            id: oldParameter.id,
            name: oldParameter.name,
            description: oldParameter.description);

  factory DynamicParameterData.fromJson(Map<String, dynamic> json) {
    return DynamicParameterData(
        id: json['id'], name: json['name'], description: json['description']);
  }

  Widget display() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [Text("\$$name"), Text(description)],
    );
  }
}
