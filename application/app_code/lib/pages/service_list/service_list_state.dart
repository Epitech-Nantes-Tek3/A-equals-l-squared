import 'package:application/language/language.dart';
import 'package:application/material_lib_functions/material_functions.dart';
import 'package:application/pages/create_area/create_area_functional.dart';
import 'package:application/pages/service_list/service_list_page.dart';
import 'package:flutter/material.dart';

import '../home/home_functional.dart';

class ServiceListPageState extends State<ServiceListPage> {
  /// Display all the service
  Widget displayAllService() {
    List<Widget> serviceVis = <Widget>[];

    for (var temp in serviceDataList) {
      serviceVis.add(materialElevatedButtonArea(
          ElevatedButton(
              style: ElevatedButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
                side: const BorderSide(width: 3),
              ),
              onPressed: () {
                goToCreateAreaPage(context);
              },
              child: temp.display(context)),
          context,
          sizeOfButton: 1,
          isShadowNeeded: true));
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
            child: Center(
                child: Container(
                    margin: const EdgeInsets.symmetric(
                        horizontal: 30, vertical: 30),
                    child: SizedBox(
                      width: isDesktop(context)
                          ? 600
                          : MediaQuery.of(context).size.width,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: <Widget>[
                              IconButton(
                                  onPressed: () {
                                    setState(() {
                                      goToHomePage(context);
                                    });
                                  },
                                  icon: const Icon(Icons.arrow_back_ios)),
                              Text(
                                getSentence('SERVLIST-01'),
                                style: const TextStyle(
                                    fontFamily: 'Roboto-Bold', fontSize: 25),
                              )
                            ],
                          ),
                          Text(getSentence('SERVLIST-02')),
                          const SizedBox(
                            height: 20,
                          ),
                          displayAllService(),
                        ],
                      ),
                    )))));
  }
}
