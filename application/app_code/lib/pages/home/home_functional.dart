import 'dart:convert';

import 'package:application/flutter_objects/news_letter_data.dart';
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

/// List of all the NewsLetter data
List<NewsLetterData> newsLetterDataList = <NewsLetterData>[];

/// Function pointer needed to update the Home Page
Function? updatePage;

/// local variable telling if we wanted to logout
bool logout = false;

/// Navigation function -> Go to Home page
void goToHomePage(BuildContext context) {
  if (updatePage != null) {
    updatePage!();
  }
  context.go('/');
}

/// Utility function used to sort area data by name
void sortAreaDataList(String name) {
  if (name == '') {
    areaDataList.sort((a, b) {
      return b.updatedAt.toString().compareTo(a.updatedAt.toString());
    });
  } else {
    areaDataList.sort((a, b) {
      return b.name.compareTo(a.name);
    });
    areaDataList.sort((a, b) {
      return name.compareTo(a.name);
    });
  }
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
      Uri.parse('http://$serverIp:8080/api/area'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
    );

    if (response.statusCode == 200) {
      List<AreaData> newList = <AreaData>[];
      var json = jsonDecode(response.body);
      for (var temp in json) {
        newList.add(AreaData.fromJson(temp));
      }
      areaDataList = newList;
      sortAreaDataList("");
    }

    response = await http.get(
      Uri.parse('http://$serverIp:8080/api/newsLetter'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
    );

    if (response.statusCode == 200) {
      List<NewsLetterData> newList = <NewsLetterData>[];
      var json = jsonDecode(response.body);
      for (var temp in json) {
        newList.add(NewsLetterData.fromJson(temp));
      }
      newsLetterDataList = newList;
    }
  } catch (err) {
    debugPrint(err.toString());
  }
}
