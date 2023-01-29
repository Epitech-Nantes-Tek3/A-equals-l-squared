import 'package:flutter/material.dart';

/// This class is the service class.
/// It contains all information about a service
class ServiceData {
  String name;
  String description;
  DateTime createdAt;

  /// Constructor of the service class
  ServiceData({
    required this.name,
    required this.description,
    required this.createdAt,
  });

  /// Convert a json map into the class
  factory ServiceData.fromJson(Map<String, dynamic> json) {
    return ServiceData(
      name: json['service']['name'],
      description: json['service']['description'],
      createdAt: DateTime.parse(json['service']['createdAt']),
    );
  }

  /// Function to display the name of a Service
  Widget displayServiceName() {
    return Column(
      children: <Widget>[
        Text(name),
      ],
    );
  }

  /// Function to display the description of a Service
  Widget displayServiceDescription() {
    return Column(
      children: <Widget>[
        Text(description),
      ],
    );
  }

  /// Function to display all information about a Service
  Widget displayServiceWithInfo() {
    return Column(
      children: <Widget>[
        Row(
          children: <Widget>[
            Row(
              children: <Widget>[
                const Icon(Icons.access_alarm),
                Text('Discord Test : $name!'),
              ],
            ),
          ],
        ),
        Row(children: <Widget>[
          Text('Discord description : $description'),
        ]),
      ],
    );
  }
}
