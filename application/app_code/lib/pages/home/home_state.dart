import 'package:application/network/informations.dart';
import 'package:application/pages/home/home_functional.dart';
import 'package:application/pages/settings/settings_functional.dart';
import 'package:flutter/material.dart';

import '../login/login_page.dart';
import 'home_page.dart';

class HomePageState extends State<HomePage> {
  /// local variable telling if we wanted to logout
  bool _logout = false;

  @override
  void initState() {
    super.initState();
    updateAllFlutterObject(context);
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
