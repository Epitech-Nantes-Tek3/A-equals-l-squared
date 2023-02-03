import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;

import '../../flutter_objects/area_data.dart';
import '../../flutter_objects/service_data.dart';
import '../../network/informations.dart';

/// List of all the Flutter data, represented by the services
List<ServiceData> serviceDataList = <ServiceData>[];

/// List of all the Area data
List<AreaData> areaDataList = <AreaData>[];

/// Function pointer needed to update the Home Page
Function? updatePage;

/// Navigation function -> Go to Home page
void goToHomePage(BuildContext context) {
  context.go('/');
}

/// Update all the Flutter object and call the api
Future<void> updateAllFlutterObject() async {
  try {
    var response = await http.get(
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

    response = await http.get(
      Uri.parse('http://$serverIp:8080/api/get/area'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
    );

    if (response.statusCode == 200) {
      List<AreaData> newList = <AreaData>[];
      var json = jsonDecode(response.body);
      for (var temp in json['data']['areas']) {
        newList.add(AreaData.fromJson(temp));
      }
      areaDataList = newList;
    }
  } catch (err) {
    debugPrint(err.toString());
  }
}
