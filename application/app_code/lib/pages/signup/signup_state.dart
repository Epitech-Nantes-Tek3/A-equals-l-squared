import 'dart:convert';

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
    return const Text('Log In To A=l²',
        textAlign: TextAlign.center,
        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 48));
  }

  /// This function display our logo and the login name of our project
  Widget displayLogoAndName() {
    return Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[displayLogo(120), displayAreaLoginSentence()]);
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
            child: Padding(
                padding: const EdgeInsets.only(top: 50),
                child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 30),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        displayLogoAndName(),
                        const Text(
                          'Welcome to Signup page !',
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 22),
                        ),
                        (getHostConfigField()),
                        (TextFormField(
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            labelText: 'Username',
                          ),
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: (String? value) {
                            if (value != null && value.length <= 4) {
                              return 'Username must be min 5 characters long.';
                            }
                            _username = value;
                            return null;
                          },
                        )),
                        (TextFormField(
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            labelText: 'E-mail',
                          ),
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
                        )),
                        (TextFormField(
                          obscureText: true,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            labelText: 'Password',
                          ),
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: (String? value) {
                            if (value != null && value.length <= 7) {
                              return 'Password must be min 8 characters long.';
                            }
                            _password = value;
                            return null;
                          },
                        )),
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
                        ElevatedButton(
                          key: const Key('SendSignupButton'),
                          onPressed: () {
                            setState(() {
                              _futureSignup = apiAskForSignup();
                            });
                          },
                          child: const Text('Signup'),
                        ),
                        TextButton(
                          key: const Key('GoLoginButton'),
                          onPressed: () {
                            goToLoginPage(context);
                          },
                          child: const Text('Back to login screen...'),
                        ),
                      ],
                    )))));
  }
}
