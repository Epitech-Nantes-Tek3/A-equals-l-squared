import 'dart:convert';

import 'package:application/network/informations.dart';
import 'package:application/pages/home/home_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../signup/signup_functional.dart';
import 'login_functional.dart';
import 'login_page.dart';

class LoginPageState extends State<LoginPage> {
  /// email to login with
  String? _email;

  /// password to login with
  String? _password;

  /// future api answer
  late Future<String> _futureLogin;

  /// Network function calling the api to login
  Future<String> apiAskForLogin() async {
    if (_email == null || _password == null) {
      return 'Please fill all the field !';
    }
    var response = await http.post(
      Uri.parse('http://$serverIp:8080/api/login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(
          <String, String>{'email': _email!, 'password': _password!}),
    );

    if (response.statusCode == 201) {
      try {
        token = jsonDecode(response.body)['data']['token'];
        isAuth = true;
        return 'Login succeed !';
      } catch (err) {
        return 'Invalid token... Please retry';
      }
    } else {
      return 'Invalid credentials.';
    }
  }

  /// Initialization function for the api answer
  Future<String> getAFirstLoginAnswer() async {
    return '';
  }

  @override
  void initState() {
    super.initState();
    _futureLogin = getAFirstLoginAnswer();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: FutureBuilder<String>(
        future: _futureLogin,
        builder: (context, snapshot) {
          if (snapshot.hasData || snapshot.hasError) {
            if (isAuth) {
              return const HomePage();
            }
            return Padding(
              padding: const EdgeInsets.only(top: 50),
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 30),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: <Widget>[
                    const Text('Log In To A=l²',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 48)),

                    getHostConfigField(),
                    TextButton.icon(
                        label: const Text('Continue with Apple Account'),
                        icon: const Icon(Icons.apple),
                        onPressed: () {
                          print('Pressed');
                        }),
                    TextButton.icon(
                        label: const Text('Continue with Google Account'),
                        icon: Icon(Icons.access_alarm),
                        onPressed: () {
                          print('Pressed');
                        }),

                    /// Put Login with Gmail or an other login
                    Column(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        TextFormField(
                          decoration: InputDecoration(
                            contentPadding: const EdgeInsets.all(20),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(5.0),
                            ),
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
                        ),
                        const SizedBox(height: 30),
                        TextFormField(
                          obscureText: true,
                          decoration: InputDecoration(
                            contentPadding: const EdgeInsets.all(20),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(5.0),
                            ),
                            labelText: "Password",
                          ),
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
                    ),

                    if (snapshot.hasError)
                      Text('${snapshot.error}')
                    else
                      Text(snapshot.data!),
                    Column(
                      children: <Widget>[
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            shadowColor: Colors.black,
                            elevation: 3,
                          ),
                          key: const Key('SendLoginButton'),
                          onPressed: () {
                            setState(() {
                              _futureLogin = apiAskForLogin();
                            });
                          },
                          child: const Text('Continue with Email',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                        TextButton(
                          key: const Key('GoSignupButton'),
                          onPressed: () {
                            goToSignupPage(context);
                          },
                          child: const Text('No account ? Go to Signup',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }
          return const CircularProgressIndicator();
        },
      ),
    ));
  }
}
