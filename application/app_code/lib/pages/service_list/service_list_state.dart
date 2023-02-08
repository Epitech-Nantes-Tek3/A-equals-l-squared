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
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
            side: const BorderSide(width: 3, color: Colors.white),

            /// Change when DB is Up
            primary: Colors.white,
          ),
          onPressed: () {
            createdAreaContent = <ServiceData>[];
            createdAreaContent.add(temp);
            goToCreateAreaPage(context);
          },
          child: temp.display()));
      serviceVis.add(const SizedBox(
        height: 10,
      ));
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: serviceVis,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SingleChildScrollView(
            child: Container(
      margin: const EdgeInsets.symmetric(horizontal: 30, vertical: 30),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              IconButton(
                  onPressed: () {
                    setState(() {
                      goToHomePage(context);
                    });
                  },
                  icon: const Icon(Icons.home_filled)),
              const Text(
                'Service List page',
                style: TextStyle(fontFamily: 'Roboto-Bold', fontSize: 25),
              )
            ],
          ),
          const Text(
              'All our implemented Services, if you want to create something with one of these, click on it !'),
          const SizedBox(
            height: 20,
          ),
          displayAllService(),
        ],
      ),
    )));
  }
}
