import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;

import '../../flutter_objects/service_data.dart';
import '../../network/informations.dart';

/// List of all the Flutter data, represented by the services
List<ServiceData> serviceDataList = <ServiceData>[];

/// Navigation function -> Go to Home page
void goToHomePage(BuildContext context) {
  updateAllFlutterObject(context);
  context.go('/');
}

/// Update all the Flutter object and call the api
void updateAllFlutterObject(BuildContext context) async {
  try {
    final response = await http.get(
      Uri.parse('http://$serverIp:8080/api/get/service'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
    );

    if (response.statusCode == 200) {
      List<ServiceData> newList = <ServiceData>[];
      var json = jsonDecode(response.body);
      for (var temp in json['data']['services']) {
        newList.add(ServiceData.fromJson(temp));
      }
      serviceDataList = newList;
    }
  } catch (err) {
    debugPrint(err.toString());
  }
}
