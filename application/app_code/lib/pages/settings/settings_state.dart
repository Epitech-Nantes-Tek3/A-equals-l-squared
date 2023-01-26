import 'dart:convert';

import 'package:application/network/informations.dart';
import 'package:application/pages/settings/settings_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../login/login_functional.dart';

class SettingsPageState extends State<SettingsPage> {
  /// future api answer
  late Future<String> _futureAnswer;

  /// Network function calling the api to delete account
  Future<String> apiAskForDelete() async {
    final response = await http.get(
      Uri.parse('http://$serverIp:8080/api/user/deleteAccount'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text('Welcome to Settings page'),
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
