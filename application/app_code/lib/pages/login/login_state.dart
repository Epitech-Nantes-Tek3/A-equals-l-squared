import 'dart:convert';

import 'package:application/language/language.dart';
import 'package:application/network/informations.dart';
import 'package:application/pages/home/home_functional.dart';
import 'package:application/pages/home/home_page.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../flutter_objects/user_data.dart';
import '../../material_lib_functions/material_functions.dart';
import '../signup/signup_functional.dart';
import 'login_page.dart';

class LoginPageState extends State<LoginPage> {
  /// email to login with
  String? _email;

  /// password to login with
  String? _password;

  /// To know if an user connect himself with email method
  bool _isConnexionWithEmail = false;

  /// future api answer
  late Future<String> _futureLogin;

  /// Network function calling the api to login with Google
  Future<String> _signInGoogle() async {
    try {
      GoogleSignIn googleSignIn = GoogleSignIn(
        clientId:
            '770124443966-jh4puirdfde87lb64bansm4flcfs7vq9.apps.googleusercontent.com',
        scopes: [
          'email',
          'profile',
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events'
        ],
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
          await updateAllFlutterObject();
          return 'Login succeed !';
        } catch (err) {
          return 'Invalid token... Please retry';
        }
      } else {
        try {
          return jsonDecode(response.body)['message'];
        } catch (err) {
          return 'Google Auth temporarily desactivated.';
        }
      }
    } catch (e) {
      debugPrint(e.toString());
      return 'Google Auth temporarily desactivated.';
    }
  }

  /// Network function calling the api to login
  Future<String> apiAskForLogin() async {
    if (_email == null || _password == null) {
      return 'Please fill all the field !';
    }
    late http.Response response;
    try {
      response = await http.post(
        Uri.parse('http://$serverIp:8080/api/login'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(
            <String, String>{'email': _email!, 'password': _password!}),
      );
    } catch (err) {
      return 'Connection refused.';
    }

    if (response.statusCode == 201) {
      try {
        userInformation = UserData.fromJson(jsonDecode(response.body)['data']);
        await updateAllFlutterObject();
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

  /// Load the selected language from the desktop memory
  void loadSelectedLanguage() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    selectedLanguage = prefs.getString('selectedLanguage') ?? selectedLanguage;
  }

  /// Initialization function for the api answer
  Future<String> getAFirstLoginAnswer() async {
    return '';
  }

  /// This function display the login name of our project
  Widget displayAreaName() {
    return Text(getSentence('LOGIN-01'),
        textAlign: TextAlign.center,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 42));
  }

  /// This function display our logo and the login name of our project
  Widget displayLogoAndName() {
    return Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[displayLogo(90), displayAreaName()]);
  }

  /// This function display the google button for log with google AUTH
  Widget displayTextButtonGoogleLogin() {
    return TextButton.icon(
        label: Text(
          getSentence('LOGIN-03'),
          style: TextStyle(color: getOurBlueAreaColor(100)),
        ),
        icon: Icon(
          Icons.account_circle_sharp,
          color: getOurBlueAreaColor(100),
        ),
        onPressed: () {
          setState(() {
            _futureLogin = _signInGoogle();
          });
        });
  }

  /// This function display the google button for log with google AUTH and the apple button for log with apple AUTH
  Widget displayForRequestWhatConnectionIsUsed() {
    return Column(children: <Widget>[displayTextButtonGoogleLogin()]);
  }

  /// This function display the button for create a new account
  Widget displayButtonRequestANewAccount() {
    return TextButton(
      key: const Key('GoSignupButton'),
      onPressed: () {
        goToSignupPage(context);
      },
      child: Text(
        getSentence('LOGIN-04'),
        style: TextStyle(color: getOurBlueAreaColor(100)),
      ),
    );
  }

  /// This function display all widget for the login with an email
  Widget displayButtonRequestForEmailLogin() {
    return Column(
      children: <Widget>[
        SizedBox(
          child: materialElevatedButtonArea(
            ElevatedButton(
              key: const Key('SendLoginButton'),
              onPressed: () {
                setState(() {
                  _isConnexionWithEmail = true;
                });
              },
              child: Text(getSentence('LOGIN-05'),
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      fontFamily: 'Roboto-Black')),
            ),
            context,
            primaryColor: getOurBlueAreaColor(100),
            borderWith: 1,
            borderColor: getOurBlueAreaColor(100),
            sizeOfButton: 1.8,
            isShadowNeeded: true,
          ),
        ),
        if (_isConnexionWithEmail == false)
          displayForRequestWhatConnectionIsUsed(),
        displayButtonRequestANewAccount()
      ],
    );
  }

  /// This function display widgets for connexion password with an email
  Widget displayInputForEmailConnexion(snapshot) {
    return Column(children: <Widget>[
      SizedBox(
          child: materialElevatedButtonArea(
        ElevatedButton(
          key: const Key('SendLoginButton'),
          onPressed: () {
            setState(() {
              _futureLogin = apiAskForLogin();
            });
          },
          child: Text(
            getSentence('LOGIN-06'),
            style: const TextStyle(color: Colors.white),
          ),
        ),
        context,
        primaryColor: getOurBlueAreaColor(100),
        borderWith: 1,
        borderColor: getOurBlueAreaColor(100),
        sizeOfButton: 1.8,
        isShadowNeeded: true,
      )),
      displayButtonRequestANewAccount(),
    ]);
  }

  /// This function display the button for request a new password
  Widget displayResetAndForgotPassword() {
    return Column(
      children: <Widget>[
        TextButton(
          key: const Key('AskResetButton'),
          onPressed: () {
            setState(() {
              _futureLogin = apiAskForResetPassword();
            });
          },
          child: Text(
            getSentence('LOGIN-07'),
            style: TextStyle(fontSize: 12, color: getOurBlueAreaColor(100)),
          ),
        ),
      ],
    );
  }

  /// This function display input for email login (input mail and password)
  Widget displayInputForEmailLogin(snapshot) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        /// Put Login with Gmail or an other login
        TextFormField(
          decoration: InputDecoration(
            contentPadding: const EdgeInsets.all(20),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(5.0),
            ),
            labelText: getSentence('LOGIN-09'),
          ),
          initialValue: _email,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: (String? value) {
            if (value != null &&
                !RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                    .hasMatch(value)) {
              return getSentence('LOGIN-10');
            }
            _email = value;
            return null;
          },
        ),
        const SizedBox(
          height: 20,
        ),
        if (_isConnexionWithEmail == true)
          Column(
            children: [
              TextFormField(
                obscureText: true,
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  labelText: getSentence('LOGIN-11'),
                ),
                autovalidateMode: AutovalidateMode.onUserInteraction,
                validator: (String? value) {
                  if (value != null && value.length <= 7) {
                    return getSentence('LOGIN-12');
                  }
                  _password = value;
                  return null;
                },
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  displayResetAndForgotPassword(),
                ],
              ),
            ],
          ),
        if (_isConnexionWithEmail == true && snapshot.hasError)
          Text(
            '{$snapshot.error}',
            style: const TextStyle(fontSize: 12),
          )
        else
          Text(
            snapshot.data!,
            style: const TextStyle(fontSize: 12),
          ),
      ],
    );
  }

  @override
  void initState() {
    super.initState();
    loadSelectedLanguage();
    _futureLogin = getAFirstLoginAnswer();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: false,
        body: Center(
          child: FutureBuilder<String>(
            future: _futureLogin,
            builder: (context, snapshot) {
              if (snapshot.hasData || snapshot.hasError) {
                if (userInformation != null) {
                  return const HomePage();
                }
                logout = false;
                return Center(
                    child: Container(
                        margin: const EdgeInsets.symmetric(
                            horizontal: 30, vertical: 12),
                        child: SizedBox(
                            width: isDesktop(context)
                                ? 600
                                : MediaQuery.of(context).size.width,
                            child: Column(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceEvenly,
                                children: <Widget>[
                                  displayLogoAndName(),
                                  const SizedBox(
                                    height: 20,
                                  ),
                                  if (_isConnexionWithEmail)
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.start,
                                      children: [
                                        IconButton(
                                            onPressed: () {
                                              setState(() {
                                                _isConnexionWithEmail = false;
                                              });
                                            },
                                            icon: Icon(
                                              Icons.arrow_back_ios,
                                              color: getOurBlueAreaColor(100),
                                            ))
                                      ],
                                    ),
                                  getHostConfigField(),
                                  displayInputForEmailLogin(snapshot),
                                  if (_isConnexionWithEmail == false)
                                    displayButtonRequestForEmailLogin(),
                                  if (_isConnexionWithEmail)
                                    displayInputForEmailConnexion(snapshot),
                                ]))));
              }
              return const CircularProgressIndicator();
            },
          ),
        ));
  }
}
