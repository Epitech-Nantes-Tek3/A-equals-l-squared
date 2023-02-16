import 'package:flutter/material.dart';

/// This class is the dynamicParameter class.
/// It contains all information about a dynamicParameter
class DynamicParameterData {
  String id;
  String name;
  String description;

  /// Constructor of the dynamicParameter class
  DynamicParameterData(
      {required this.id, required this.name, required this.description});

  /// Utilitary function used for cloning the class
  DynamicParameterData.clone(DynamicParameterData oldParameter)
      : this(
            id: oldParameter.id,
            name: oldParameter.name,
            description: oldParameter.description);

  /// Convert a json map into the class
  factory DynamicParameterData.fromJson(Map<String, dynamic> json) {
    return DynamicParameterData(
        id: json['id'], name: json['name'], description: json['description']);
  }

  /// Function returning a visual representation of a dynamicParameter
  Widget display() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [Text("\$$name"), Text(description)],
    );
  }
}
