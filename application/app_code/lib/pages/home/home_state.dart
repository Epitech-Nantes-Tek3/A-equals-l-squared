import 'package:application/pages/login/login_functional.dart';
import 'package:flutter/material.dart';

import 'home_page.dart';

class HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          const Text('Home page !'),
          ElevatedButton(
            onPressed: () {
              goToLoginPage(context);
            },
            child: const Text('Go to the login screen'),
          ),
        ],
      ),
    ));
  }
}
