import 'package:application/network/informations.dart';
import 'package:application/pages/settings/settings_page.dart';
import 'package:flutter/material.dart';

import '../login/login_functional.dart';

class SettingsPageState extends State<SettingsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text('Welcome to Settings page'),
          ElevatedButton(
            key: const Key('SettingsHomeButton'),
            onPressed: () {
              setState(() {
                goToLoginPage(context);
              });
            },
            child: const Text('Go Home'),
          ),
        ],
      ),
    ));
  }
}
