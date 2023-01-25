import 'dart:convert';

import 'package:application/network/informations.dart';
import 'package:application/pages/home/home_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../signup/signup_functional.dart';
import 'login_functional.dart';
import 'login_page.dart';

class LoginPageState extends State<LoginPage> {
  String? _email;

  String? _password;

  late Future<String> _futureLogin;

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
                    if (value != null && value.length <= 4) {
                      return 'Password must be min 5 characters long.';
                    }
                    _password = value;
                    return null;
                  },
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
              ],
            );
          }
          return const CircularProgressIndicator();
        },
      ),
    ));
  }
}
