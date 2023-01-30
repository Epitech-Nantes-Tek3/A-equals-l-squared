import 'dart:convert';

import 'package:application/network/informations.dart';
import 'package:application/pages/home/home_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../flutter_objects/user_data.dart';
import '../signup/signup_functional.dart';
import 'login_page.dart';

class LoginPageState extends State<LoginPage> {
  /// email to login with
  String? _email;

  /// password to login with
  String? _password;

  bool _isConnexionWithEmail = false;

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
        userInformation = UserData.fromJson(jsonDecode(response.body)['data']);
        return 'Login succeed !';
      } catch (err) {
        return 'Invalid token... Please retry';
      }
    } else {
      try {
        return jsonDecode(response.body)['message'];
      } catch (err) {
        return 'Invalid credentials.';
      }
    }
  }

  /// Network function calling the API to reset password
  Future<String> apiAskForResetPassword() async {
    if (_email == null) {
      return 'Please provide a valid email !';
    }
    var response = await http.post(
      Uri.parse('http://$serverIp:8080/api/user/resetPassword'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{'email': _email!}),
    );
    try {
      return jsonDecode(response.body);
    } catch (err) {
      return 'Invalid e-mail address. Please check it !';
    }
  }

  /// Initialization function for the api answer
  Future<String> getAFirstLoginAnswer() async {
    return '';
  }

  /// This function display our logo
  Widget displayLogo() {
    return const Icon(size: 120, Icons.apple);
  }

  /// This function display the login name of our project
  Widget displayAreaName() {
    return const Text('Log In To A=l²',
        textAlign: TextAlign.center,
        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 48));
  }

  /// This function display our logo and the login name of our project
  Widget displayLogoAndName() {
    return Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[displayLogo(), displayAreaName()]);
  }

  /// This function display the apple button for log with apple AUTH
  Widget displayTextButtonAppleLogin() {
    return TextButton.icon(
        label: const Text('Continue with Apple Account'),
        icon: const Icon(Icons.apple),
        onPressed: () {});
  }

  /// This function display the google button for log with google AUTH
  Widget displayTextButtonGoogleLogin() {
    return TextButton.icon(
        label: const Text('Continue with Google Account'),
        icon: const Icon(Icons.access_alarm),
        onPressed: () {});
  }

  /// This function display the google button for log with google AUTH and the apple button for log with apple AUTH
  Widget displayForRequestWhatConnectionIsUsed() {
    return Column(children: <Widget>[
      displayTextButtonAppleLogin(),
      displayTextButtonGoogleLogin()
    ]);
  }

  /// This function display the button for create a new account
  Widget displayButtonRequestANewAccount() {
    return TextButton(
      key: const Key('GoSignupButton'),
      onPressed: () {
        goToSignupPage(context);
      },
      child: const Text('No account ? Go to Signup'),
    );
  }

  /// This function display all widget for the login with an email
  Widget displayButtonRequestForEmailLogin() {
    return Column(
      children: <Widget>[
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              shadowColor: Colors.black,
              elevation: 5,
            ),
            key: const Key('SendLoginButton'),
            onPressed: () {
              setState(() {
                _isConnexionWithEmail = true;
              });
            },
            child: const Text('Continue with Email',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          ),
        ),
        if (_isConnexionWithEmail == false)
          displayForRequestWhatConnectionIsUsed(),
        displayButtonRequestANewAccount()
      ],
    );
  }

  /// This function display widgets for connexion password with an email
  Widget displayPasswordInputForEmailConnexion(snapshot) {
    return Column(children: <Widget>[
      TextFormField(
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
      ),
      if (snapshot.hasError)
        Text('${snapshot.error}')
      else
        Text(snapshot.data!),
      SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          key: const Key('SendLoginButton'),
          onPressed: () {
            setState(() {
              _futureLogin = apiAskForLogin();
            });
          },
          child: const Text('Login'),
        ),
      ),
      displayResetAndForgotPassword(),
    ]);
  }

  /// These function display the button for request a new password
  Widget displayResetAndForgotPassword() {
    return Column(
      children: <Widget>[
        displayButtonRequestANewAccount(),
        TextButton(
          key: const Key('AskResetButton'),
          onPressed: () {
            setState(() {
              _futureLogin = apiAskForResetPassword();
            });
          },
          child: const Text('Forgot Password ? Reset it'),
        ),
      ],
    );
  }

  /// This function take a Widget in parameter and attribute a shadow black
  Widget materialShadowForArea(Widget widget) {
    return Material(elevation: 5, shadowColor: Colors.black, child: widget);
  }

  /// This function return the Blue Color for our Area project
  Color materialColorBlueForArea() {
    return const Color.fromRGBO(6, 161, 228, 100);
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
            if (userInformation != null) {
              return const HomePage();
            }
            return Padding(
                padding: const EdgeInsets.only(top: 50),
                child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 30),
                    child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: <Widget>[
                          displayLogoAndName(),
                          materialShadowForArea(getHostConfigField()),

                          /// Put Login with Gmail or an other login
                          materialShadowForArea(TextFormField(
                            decoration: InputDecoration(
                              contentPadding: const EdgeInsets.all(20),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(5.0),
                              ),
                              labelText: 'E-mail',
                            ),
                            initialValue: _email,
                            autovalidateMode:
                                AutovalidateMode.onUserInteraction,
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
                          if (snapshot.hasError)
                            Text('${snapshot.error}')
                          else
                            Text(snapshot.data!),
                          if (_isConnexionWithEmail == false)
                            displayButtonRequestForEmailLogin(),
                          if (_isConnexionWithEmail)
                            displayPasswordInputForEmailConnexion(snapshot),
                          if (_isConnexionWithEmail)
                            TextButton(
                              key: const Key('GoLoginPageButton'),
                              onPressed: () {
                                setState(() {
                                  _isConnexionWithEmail = false;
                                });
                              },
                              child: const Text('Back to login page...'),
                            ),
                        ])));
          }
          return const CircularProgressIndicator();
        },
      ),
    ));
  }
}
