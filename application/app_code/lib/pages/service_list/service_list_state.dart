import 'package:application/flutter_objects/service_data.dart';
import 'package:application/pages/create_area/create_area_functional.dart';
import 'package:application/pages/service_list/service_list_page.dart';
import 'package:flutter/material.dart';

import '../home/home_functional.dart';

class ServiceListPageState extends State<ServiceListPage> {
  /// Display all the service
  Widget displayAllService() {
    List<Widget> serviceVis = <Widget>[];

    for (var temp in serviceDataList) {
      serviceVis.add(ElevatedButton(
          onPressed: () {
            createdAreaContent = <ServiceData>[];
            createdAreaContent.add(temp);
            goToCreateAreaPage(context);
          },
          child: temp.display()));
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: serviceVis,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text('Welcome to Service List page'),
          displayAllService(),
          ElevatedButton(
            key: const Key('ServiceListHomeButton'),
            onPressed: () {
              setState(() {
                goToHomePage(context);
              });
            },
            child: const Text('Go Home'),
          ),
        ],
      ),
    ));
  }
}
