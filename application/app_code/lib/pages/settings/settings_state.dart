import 'dart:convert';

import 'package:application/network/informations.dart';
import 'package:application/pages/settings/settings_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../login/login_functional.dart';

class SettingsPageState extends State<SettingsPage> {
  /// username to update
  String? _username = userInformation?.userName;

  /// email to update
  String? _email = userInformation?.email;

  /// password to update
  String? _password = "";

  /// future api answer
  late Future<String> _futureAnswer;

  /// Network function calling the api for updating user information
  Future<String> apiAskForUpdate() async {
    if (_username == null || _email == null || _password == "") {
      return 'Please fill all the field !';
    }
    final response = await http.post(
      Uri.parse('http://$serverIp:8080/api/user/update'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
      body: jsonEncode(<String, String>{
        'username': _username!,
        'email': _email!,
        'password': _password!
      }),
    );

    try {
      if (response.statusCode == 200) {
        userInformation?.userName = _username!;
        userInformation?.email = _email!;
      } else {
        _username = userInformation?.userName;
        _email = userInformation?.email;
        _password = null;
      }
      return jsonDecode(response.body);
    } catch (err) {
      return 'Invalid user token. Please go back to login.';
    }
  }

  /// Network function calling the api to delete account
  Future<String> apiAskForDelete() async {
    final response = await http.get(
      Uri.parse('http://$serverIp:8080/api/user/deleteAccount'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
    );

    try {
      return jsonDecode(response.body);
    } catch (err) {
      return 'Invalid user token. Please go back to login.';
    }
  }

  /// Initialization function for the api answer
  Future<String> getAFirstApiAnswer() async {
    return '';
  }

  @override
  void initState() {
    super.initState();
    _futureAnswer = getAFirstApiAnswer();
  }

  /// Display function returning a user data customizable visualization
  Widget userDataVisualization() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        TextFormField(
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Username',
          ),
          initialValue: _username,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: (String? value) {
            if (value != null && value.length <= 4) {
              return 'Username must be min 5 characters long.';
            }
            _username = value;
            return null;
          },
        ),
        TextFormField(
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'E-mail',
          ),
          initialValue: _email,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: (String? value) {
            if (value != null &&
                !RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                    .hasMatch(value)) {
              return 'Must be a valid email.';
            }
            _email = value;
            return null;
          },
        ),
        TextFormField(
          obscureText: true,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Password',
          ),
          initialValue: _password,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: (String? value) {
            if (value != null && value.length <= 7) {
              return 'Password must be min 8 characters long.';
            }
            _password = value;
            return null;
          },
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text('Welcome to Settings page'),
          userDataVisualization(),
          ElevatedButton(
            key: const Key('AskUpdateButton'),
            onPressed: () {
              setState(() {
                _futureAnswer = apiAskForUpdate();
              });
            },
            child: const Text('Update account information'),
          ),
          ElevatedButton(
            key: const Key('AskDeleteButton'),
            onPressed: () {
              setState(() {
                _futureAnswer = apiAskForDelete();
              });
            },
            child: const Text('Delete account'),
          ),
          FutureBuilder<String>(
            future: _futureAnswer,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return Text(snapshot.data!);
              } else if (snapshot.hasError) {
                return Text('${snapshot.error}');
              }
              return const CircularProgressIndicator();
            },
          ),
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
