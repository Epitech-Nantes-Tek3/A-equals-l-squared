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
  /// local variable telling if we wanted to logout
  bool _logout = false;

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
      areaVis.add(ElevatedButton(
          onPressed: () {
            updatingArea = temp;
            goToUpdateAreaPage(context);
          },
          child: temp.display(false)));
    }
    return areaVis;
  }

  @override
  Widget build(BuildContext context) {
    if (_logout) {
      userInformation = null;
      return const LoginPage();
    } else {
      return Scaffold(
          body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: areasDisplay(),
            ),
            ElevatedButton(
              key: const Key('HomeSettingsButton'),
              onPressed: () {
                setState(() {
                  goToSettingsPage(context);
                });
              },
              child: const Text('Settings'),
            ),
            ElevatedButton(
              key: const Key('HomeCreateAreaButton'),
              onPressed: () {
                setState(() {
                  goToCreateAreaPage(context);
                });
              },
              child: const Text('Create Area'),
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
                  _logout = true;
                });
              },
              child: const Text('Logout'),
            ),
          ],
        ),
      ));
    }
  }
}
