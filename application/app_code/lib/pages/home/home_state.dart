import 'package:flutter/material.dart';

import '../login/login_functional.dart';
import '../login/login_page.dart';
import 'home_page.dart';

class HomePageState extends State<HomePage> {
  /// local variable telling if we wanted to logout
  bool _logout = false;

  @override
  Widget build(BuildContext context) {
    if (_logout) {
      isAuth = false;
      return const LoginPage();
    } else {
      return Scaffold(
          body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
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
