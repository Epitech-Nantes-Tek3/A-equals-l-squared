import 'dart:convert';

import 'package:application/language/language.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../material_lib_functions/material_functions.dart';
import '../../network/informations.dart';
import '../login/login_functional.dart';
import 'signup_page.dart';

class SignupPageState extends State<SignupPage> {
  /// username to signup
  String? _username;

  /// email to signup
  String? _email;

  /// password to signup
  String? _password;

  /// future api answer
  late Future<String> _futureSignup;

  /// Network function calling the api to signup
  Future<String> apiAskForSignup() async {
    if (_username == null || _email == null || _password == null) {
      return 'Please fill all the field !';
    }
    final response = await http.post(
      Uri.parse('http://$serverIp:8080/api/signup'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'username': _username!,
        'email': _email!,
        'password': _password!
      }),
    );

    if (response.statusCode == 201) {
      return 'Signup succeed ! Check your email and go to Login page';
    } else {
      return 'Invalid e-mail address !';
    }
  }

  /// Initialization function for the api answer
  Future<String> getAFirstSignupAnswer() async {
    return '';
  }

  /// This function display the login and the name of our project
  Widget displayAreaLoginSentence() {
    return Text(getSentence('SIGNUP-01'),
        textAlign: TextAlign.center,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 42));
  }

  /// This function display our logo and the login name of our project
  Widget displayLogoAndName() {
    return Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text(""),
          displayLogo(90),
          displayAreaLoginSentence()
        ]);
  }

  @override
  void initState() {
    super.initState();
    _futureSignup = getAFirstSignupAnswer();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: false,
        body: Center(
            child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 30),
                child: SizedBox(
                    width: isDesktop(context)
                        ? 600
                        : MediaQuery.of(context).size.width,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        displayLogoAndName(),
                        Text(
                          getSentence('SIGNUP-02'),
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        getHostConfigField(),
                        TextFormField(
                          decoration: InputDecoration(
                            border: const OutlineInputBorder(),
                            labelText: getSentence('SIGNUP-05'),
                          ),
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: (String? value) {
                            if (value != null && value.length <= 4) {
                              return getSentence('SIGNUP-06');
                            }
                            _username = value;
                            return null;
                          },
                        ),
                        TextFormField(
                          decoration: InputDecoration(
                            border: const OutlineInputBorder(),
                            labelText: getSentence('SIGNUP-07'),
                          ),
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: (String? value) {
                            if (value != null &&
                                !RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                                    .hasMatch(value)) {
                              return getSentence('SIGNUP-08');
                            }
                            _email = value;
                            return null;
                          },
                        ),
                        TextFormField(
                          obscureText: true,
                          decoration: InputDecoration(
                            border: const OutlineInputBorder(),
                            labelText: getSentence('SIGNUP-09'),
                          ),
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: (String? value) {
                            if (value != null && value.length <= 7) {
                              return getSentence('SIGNUP-10');
                            }
                            _password = value;
                            return null;
                          },
                        ),
                        FutureBuilder<String>(
                          future: _futureSignup,
                          builder: (context, snapshot) {
                            if (snapshot.hasData) {
                              return Text(snapshot.data!);
                            } else if (snapshot.hasError) {
                              return Text('${snapshot.error}');
                            }
                            return const CircularProgressIndicator();
                          },
                        ),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            materialElevatedButtonArea(
                              ElevatedButton(
                                key: const Key('SendSignupButton'),
                                onPressed: () {
                                  setState(() {
                                    _futureSignup = apiAskForSignup();
                                  });
                                },
                                child: Text(getSentence('SIGNUP-03')),
                              ),
                              context,
                              primaryColor: getOurBlueAreaColor(100),
                              borderWith: 1,
                              borderColor: getOurBlueAreaColor(100),
                              sizeOfButton: 1.8,
                              isShadowNeeded: true,
                            ),
                            TextButton(
                              key: const Key('GoLoginButton'),
                              onPressed: () {
                                goToLoginPage(context, false);
                              },
                              child: Text(
                                getSentence('SIGNUP-04'),
                                style:
                                    TextStyle(color: getOurBlueAreaColor(100)),
                              ),
                            ),
                          ],
                        ),
                      ],
                    )))));
  }
}
