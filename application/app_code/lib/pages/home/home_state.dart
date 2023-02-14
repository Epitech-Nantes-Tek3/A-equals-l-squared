import 'package:application/flutter_objects/area_data.dart';
import 'package:application/network/informations.dart';
import 'package:application/pages/create_area/create_area_functional.dart';
import 'package:application/pages/home/home_functional.dart';
import 'package:application/pages/service_list/service_list_functional.dart';
import 'package:application/pages/settings/settings_functional.dart';
import 'package:application/pages/update_area/update_area_functional.dart';
import 'package:flutter/material.dart';

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

  /// Function to add two areas into a row (return list<widget>)
  /// function to add these row into column (return list<widget>)

  Widget createRowOfAreas(Widget firstArea, Widget secondArea) {
    Widget rowArea = Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children : <Widget>[
      firstArea,
      secondArea,
    ]);
    return rowArea;
  }

  Widget areaDataToElevatedButton(AreaData areaData, Color areaColor) {
    return ElevatedButton(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
          side: BorderSide(color: areaColor, width: 3),
          // Change when DB is Up
          primary: Colors.white,
        ),
        onPressed: () {
          updatingArea = areaData;
          goToUpdateAreaPage(context);
        },
        child: areaData.display(false, null));
  }

  /// THis function display all Areas in Tab
  List<Widget> createTabOfAreas() {
    List<Widget> areaVis = <Widget>[];
    late AreaData tempArea;

    var count = 1;

    for (var temp in areaDataList) {
      if (count % 2 == 0 && count != 0) {
        areaVis.add(createRowOfAreas(areaDataToElevatedButton(tempArea, tempArea.getPrimaryColor()), areaDataToElevatedButton(temp, temp.getPrimaryColor())));
      }
      tempArea = temp;
      count++;
    }
    if (count % 2 == 0) {
      areaVis.add(createRowOfAreas(areaDataToElevatedButton(tempArea, Colors.deepOrange), Row()));
    }
    return areaVis;
  }

  /// Display all the area
  List<Widget> areasDisplay() {
    List<Widget> areaVis = <Widget>[];

    for (var temp in areaDataList) {
      String str =
      temp.getAssociatedService()!.primaryColor.replaceFirst("#", "0xff");
      Color tempColor = Color(int.parse(str));
      areaVis.add(ElevatedButton(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
            side: BorderSide(color: tempColor, width: 3),
            // Change when DB is Up
            primary: Colors.white,
          ),
          onPressed: () {
            updatingArea = temp;
            goToUpdateAreaPage(context);
          },
          child: temp.display(false, null)));
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
                    /// children: areasDisplay(),
                    children: createTabOfAreas(),
                  ),
                  ElevatedButton(
                    key: const Key('HomeServiceButton'),
                    onPressed: () {
                      setState(() {
                        goToServiceListPage(context);
                      });
                    },
                    child: const Text('Service List'),
                  ),
                  ElevatedButton(
                    key: const Key('HomeLogoutButton'),
                    onPressed: () {
                      setState(() {
                        logout = true;
                      });
                    },
                    child: const Text('Logout'),
                  ),
                ],
              ),
            ),
          ));
    }
  }
}
