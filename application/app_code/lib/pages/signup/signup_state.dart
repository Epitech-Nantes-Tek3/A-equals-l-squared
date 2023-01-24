import 'package:flutter/material.dart';

import '../../network/informations.dart';
import '../login/login_functional.dart';
import 'signup_page.dart';

class SignupPageState extends State<SignupPage> {
  late String username;

  late String email;

  late String password;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text('Welcome to Signup page !'),
          getHostConfigField(),
          TextFormField(
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'Username',
            ),
            onSaved: (String? value) {
              username = value!;
            },
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (String? value) {
              return (value != null && value.length <= 4)
                  ? 'Username must be min 5 characters long.'
                  : null;
            },
          ),
          TextFormField(
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'E-mail',
            ),
            onSaved: (String? value) {
              email = value!;
            },
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (String? value) {
              return (value != null &&
                      !RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                          .hasMatch(value))
                  ? 'Must be a valid email.'
                  : null;
            },
          ),
          TextFormField(
            obscureText: true,
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'Password',
            ),
            onSaved: (String? value) {
              password = value!;
            },
            autovalidateMode: AutovalidateMode.onUserInteraction,
            validator: (String? value) {
              return (value != null && value.length <= 4)
                  ? 'Password must be min 5 characters long.'
                  : null;
            },
          ),
          ElevatedButton(
            key: const Key('GoLoginButton'),
            onPressed: () {
              goToLoginPage(context);
            },
            child: const Text('Back to login screen...'),
          ),
        ],
      ),
    ));
  }
}
