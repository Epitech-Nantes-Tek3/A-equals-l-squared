import 'package:flutter/material.dart';

import '../login/login_functional.dart';
import 'signup_page.dart';

class SignupPageState extends State<SignupPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          const Text('Signup page !'),
          ElevatedButton(
            key: const Key('GoLoginButton'),
            onPressed: () {
              goToLoginPage(context);
            },
            child: const Text('Go to the Login screen'),
          ),
        ],
      ),
    ));
  }
}
