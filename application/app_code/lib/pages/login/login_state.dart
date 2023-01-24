import 'package:flutter/material.dart';

import '../home/home_functional.dart';
import 'login_page.dart';

class LoginPageState extends State<LoginPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          const Text('Login page !'),
          ElevatedButton(
            key: const Key('GoHomeButton'),
            onPressed: () {
              goToHomePage(context);
            },
            child: const Text('Go to the home screen'),
          ),
        ],
      ),
    ));
  }
}
