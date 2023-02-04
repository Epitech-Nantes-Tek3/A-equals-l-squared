import 'package:flutter/material.dart';

import '../home/home_functional.dart';
import 'auth_linker_page.dart';

class AuthLinkerPageState extends State<AuthLinkerPage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text('Welcome to Auth Linker page'),
          ElevatedButton(
            key: const Key('AuthLinkerHomeButton'),
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
