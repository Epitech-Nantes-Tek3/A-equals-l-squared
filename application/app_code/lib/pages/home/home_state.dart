import 'package:application/network/informations.dart';
import 'package:application/pages/create_area/create_area_functional.dart';
import 'package:application/pages/home/home_functional.dart';
import 'package:application/pages/service_list/service_list_functional.dart';
import 'package:application/pages/settings/settings_functional.dart';
import 'package:application/pages/update_area/update_area_functional.dart';
import 'package:flutter/material.dart';

import '../../material_lib_functions/material_functions.dart';
import '../login/login_page.dart';
import 'home_page.dart';

class HomePageState extends State<HomePage> {
  /// Update state function
  void update() {
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    updatePage = update;
  }

  /// Display all the area
  List<Widget> areasDisplay() {
    List<Widget> areaVis = <Widget>[];

    for (var temp in areaDataList) {
      String str =
          temp.getAssociatedService()!.primaryColor.replaceFirst("#", "0xff");
      Color tempColor = Color(int.parse(str));
      areaVis.add(materialElevatedButtonArea(ElevatedButton(
          style: ElevatedButton.styleFrom(
          ),
          onPressed: () {
            updatingArea = temp;
            goToUpdateAreaPage(context);
          },
          child: temp.display(false, null)), false , borderColor: tempColor, borderWith: 3));
      areaVis.add(const SizedBox(height: 20));
    }
    return areaVis;
  }

  @override
  Widget build(BuildContext context) {
    if (logout) {
      userInformation = null;
      return const LoginPage();
    } else {
      return Scaffold(
          resizeToAvoidBottomInset: true,
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
                          iconSize: 30,
                          onPressed: () {
                            setState(() {
                              goToSettingsPage(context);
                            });
                          },
                          icon: const Icon(Icons.settings)),
                      IconButton(
                          iconSize: 30,
                          onPressed: () {
                            setState(() {
                              goToCreateAreaPage(context);
                            });
                          },
                          icon: const Icon(Icons.add))
                    ],
                  ),
                  const SizedBox(height: 30),
                  Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        const Text('All Areas',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 28,
                                fontFamily: 'Roboto-Bold')),
                        const SizedBox(height: 10),
                        TextFormField(
                            obscureText: true,
                            decoration: const InputDecoration(
                              border: OutlineInputBorder(),
                              labelText: 'Search an Area',
                            )),
                      ]),
                  const SizedBox(
                    height: 30,
                  ),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: areasDisplay(),
                  ),

                  materialElevatedButtonArea(ElevatedButton(
                    key: const Key('HomeServiceButton'),
                    onPressed: () {
                      setState(() {
                        goToServiceListPage(context);
                      });
                    },
                    child: const Text('Service List'),
                  ), true, primaryColor: getOurBlueAreaColor(100)),
                  ),
                ],
              ),
            ),
          ));
    }
  }
}
