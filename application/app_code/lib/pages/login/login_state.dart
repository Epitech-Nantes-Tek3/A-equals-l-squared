import 'dart:convert';

import 'package:application/network/informations.dart';
import 'package:application/pages/home/home_page.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

import '../../flutter_objects/user_data.dart';
import '../signup/signup_functional.dart';
import 'login_page.dart';

class LoginPageState extends State<LoginPage> {
  /// email to login with
  String? _email;

  /// password to login with
  String? _password;

  /// future api answer
  late Future<String> _futureLogin;

  Future<String> _signInGoogle() async {
    try {
      GoogleSignIn googleSignIn = GoogleSignIn(
        clientId:
            '770124443966-jh4puirdfde87lb64bansm4flcfs7vq9.apps.googleusercontent.com',
        scopes: ['email', 'profile'],
      );
      var googleUser =
          await googleSignIn.signInSilently() ?? await googleSignIn.signIn();
      var response = await http.post(
        Uri.parse('http://$serverIp:8080/api/login/google'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'email': googleUser!.email,
          'displayName': googleUser.displayName!,
          'id': googleUser.id
        }),
      );

      if (response.statusCode == 201) {
        try {
          userInformation =
              UserData.fromJson(jsonDecode(response.body)['data']);
          return 'Login succeed !';
        } catch (err) {
          return 'Invalid token... Please retry';
        }
      } else {
        try {
          return jsonDecode(response.body)['message'];
        } catch (err) {
          return 'Google Auth temporaly desactivated.';
        }
      }
    } catch (e) {
      debugPrint(e.toString());
      return 'Google Auth temporaly desactivated.';
    }
  }

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
            return Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                const Text('Login page !'),
                getHostConfigField(),
                TextFormField(
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
                ),
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
                ElevatedButton(
                  key: const Key('SendLoginGoogleButton'),
                  onPressed: () {
                    setState(() {
                      _signInGoogle();
                    });
                  },
                  child: const Text('Login'),
                ),
                if (snapshot.hasError)
                  Text('${snapshot.error}')
                else
                  Text(snapshot.data!),
                ElevatedButton(
                  key: const Key('SendLoginButton'),
                  onPressed: () {
                    setState(() {
                      _futureLogin = apiAskForLogin();
                    });
                  },
                  child: const Text('Login'),
                ),
                ElevatedButton(
                  key: const Key('GoSignupButton'),
                  onPressed: () {
                    goToSignupPage(context);
                  },
                  child: const Text('No account ? Go to Signup'),
                ),
                ElevatedButton(
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
          return const CircularProgressIndicator();
        },
      ),
    ));
  }
}
