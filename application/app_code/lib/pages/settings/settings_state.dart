import 'dart:convert';

import 'package:application/material_lib_functions/material_functions.dart';
import 'package:application/network/informations.dart';
import 'package:application/pages/settings/settings_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../auth_linker/auth_linker_functional.dart';
import '../home/home_functional.dart';
import '../login/login_functional.dart';

class SettingsPageState extends State<SettingsPage> {
  /// username to update
  String? _username = userInformation?.userName;

  /// email to update
  String? _email = userInformation?.email;

  /// password to update
  String? _password = "";

  /// To know what things to display
  int _settingPage = 0;

  /// future api answer
  late Future<String> _futureAnswer;

  /// Network function calling the api for updating user information
  Future<String> apiAskForUpdate() async {
    if (_username == null || _email == null || _password == "") {
      return 'Please fill all the field !';
    }
    final response = await http.post(
      Uri.parse('http://$serverIp:8080/api/user/updateData'),
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
        _password = "";
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
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const SizedBox(
          height: 10,
        ),
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
        const SizedBox(
          height: 10,
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
        const SizedBox(
          height: 10,
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
        const SizedBox(
          height: 10,
        ),
        modifierButtons(),
      ],
    );
  }

  /// This function display buttons to modified an user account
  Widget modifierButtons() {
    return Column(children: <Widget>[
      materialElevatedButtonArea(
          ElevatedButton(
            key: const Key('AskUpdateButton'),
            onPressed: () {
              setState(() {
                _futureAnswer = apiAskForUpdate();
              });
            },
            child: const Text('Update account information'),
          ), context,
          isShadowNeeded: true,
          primaryColor: getOurBlueAreaColor(100)),
      materialElevatedButtonArea(
          ElevatedButton(
            key: const Key('AskDeleteButton'),
            onPressed: () {
              setState(() {
                _futureAnswer = apiAskForDelete();
              });
            },
            child: const Text('Delete account'),
          ), context,
          isShadowNeeded: true,
          primaryColor: getOurBlueAreaColor(100)),
    ]);
  }

  /// This function display all button to give access at a settings for users
  Widget displayAllParameterButtons() {
    return Column(children: <Widget>[
      const SizedBox(height: 30),
      parameterButtonView(Icons.manage_accounts_rounded, 'User information', 1),
      const SizedBox(height: 20),
      parameterButtonView(Icons.app_settings_alt_sharp, 'Data management', 2),
      const SizedBox(height: 20),
      parameterButtonView(Icons.language, 'Language', 3),
      const SizedBox(height: 20),
      parameterButtonView(Icons.notifications_active, 'Notification', 4),
      const SizedBox(height: 20),
      parameterButtonView(Icons.connect_without_contact, 'Auth', 5),
      const SizedBox(height: 20),
      parameterButtonView(Icons.logout, 'Logout', 84),
    ]);
  }

  /// This function display headers for settings views, depends on _settingsPage
  Widget displaySettingsHeader() {
    if (_settingPage == 0) {
      return const Text(
        'Settings Page',
        style: TextStyle(fontSize: 20),
      );
    }
    if (_settingPage == 1) {
      return const Text(
        'User information',
        style: TextStyle(fontSize: 20),
      );
    }
    if (_settingPage == 2) {
      return const Text(
        'Data management',
        style: TextStyle(fontSize: 20),
      );
    }
    if (_settingPage == 3) {
      return const Text(
        'Language',
        style: TextStyle(fontSize: 20),
      );
    }
    if (_settingPage == 4) {
      return const Text(
        'Notification',
        style: TextStyle(fontSize: 20),
      );
    }
    return const Text('');
  }

  /// This function choose what Settings View display depends on _settingsPage
  Widget displaySettingsViews() {
    if (_settingPage == 0) return displayAllParameterButtons();
    if (_settingPage == 1) return userDataVisualization();
    if (_settingPage == 2) return userDataVisualization();
    if (_settingPage == 3) return userDataVisualization();
    if (_settingPage == 4) return userDataVisualization();
    if (_settingPage == 5) return goToAuthPage(context);
    if (_settingPage == 84) return userDataVisualization();
    return const Text('');
  }

  Widget goToAuthPage(context) {
    goToAuthLinkerPage(context);
    return const Text('');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SingleChildScrollView(
            child: Container(
                margin:
                    const EdgeInsets.symmetric(horizontal: 30, vertical: 30),
                child: Align(
                  alignment: Alignment.topCenter,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          IconButton(
                              onPressed: () {
                                setState(() {
                                  if (_settingPage == 0) {
                                    goToHomePage(context);
                                  } else {
                                    _settingPage = 0;
                                  }
                                });
                              },
                              icon: const Icon(Icons.home_filled),
                              color: Colors.black),
                          const SizedBox(
                            width: 30,
                          ),
                          displaySettingsHeader(),
                        ],
                      ),
                      const SizedBox(height: 30),
                      displaySettingsViews(),
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
                    ],
                  ),
                ))));
  }

  /// This function display all settings which can manage by users
  Widget parameterButtonView(IconData icon, String description, int selector) {
    return materialElevatedButtonArea(
        ElevatedButton(
            onPressed: () {
              setState(() {
                if (selector == 5) {
                  goToAuthPage(context);
                } else if (selector == 84) {
                  goToLoginPage(context);
                } else {
                  _settingPage = selector;
                }
              });
            },
            child: Column(children: <Widget>[
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Icon(
                        icon,
                        color: Colors.black,
                      ),
                      const SizedBox(width: 20),
                      Text(
                        description,
                        style: const TextStyle(color: Colors.black),
                      ),
                    ],
                  ),
                  const Icon(Icons.arrow_forward_ios_sharp, color: Colors.black)
                ],
              )
            ])), context,
        isShadowNeeded: true,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 20);
  }
}
