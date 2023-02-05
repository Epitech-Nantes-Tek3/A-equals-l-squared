import 'dart:convert';

import 'package:application/network/informations.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

import '../../flutter_objects/user_data.dart';

/// Function pointer needed to update the Auth Page
Function? updateAuthPage;

/// Navigation function -> Go to AuthLinker page
void goToAuthLinkerPage(BuildContext context) {
  if (userInformation == null) {
    context.go('/');
    return;
  }
  context.go('/auth_linker');
}

/// This class is the AuthBox class.
/// It contains all information about a Auth service
class AuthBox {
  String authName;
  String authDescription;
  bool isEnable;
  Function action;
  String? token;

  /// Constructor af the AuthBox class
  AuthBox(
      {required this.authName,
      required this.authDescription,
      required this.isEnable,
      required this.action});

  /// Return a visual representation of the AuthBox
  Widget display() {
    if (userInformation!.userToken != null) {
      if (authName == 'Google') {
        token = userInformation!.userToken!.googleToken;
      }
      if (authName == 'Discord') {
        token = userInformation!.userToken!.discordToken;
      }
      isEnable = token == null ? false : true;
    }
    return ElevatedButton(
        onPressed: () {
          if (updateAuthPage != null) {
            updateAuthPage!(action);
          }
        },
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Text(
              authName,
              style: TextStyle(color: isEnable ? Colors.green : Colors.red),
            ),
            Text(authDescription)
          ],
        ));
  }
}

/// The google service authBox
AuthBox googleAuthBox = AuthBox(
    authName: "Google",
    authDescription: "Used for all Gmail interaction",
    isEnable: false,
    action: getGoogleToken);

/// The discord service authBox
AuthBox discordAuthBox = AuthBox(
    authName: "Discord",
    authDescription: "Used for all Discord interaction",
    isEnable: false,
    action: getDiscordToken);

/// Remove / Get the Google API access token
Future<String> getGoogleToken() async {
  if (googleAuthBox.isEnable) {
    String? tokenSave = '${googleAuthBox.token}';
    googleAuthBox.token = null;
    String? error = await publishNewToken();
    if (error != null) {
      googleAuthBox.token = tokenSave;
      return error;
    }
    googleAuthBox.isEnable = false;
  } else {
    GoogleSignIn googleSignIn = GoogleSignIn(
      clientId:
          '770124443966-jh4puirdfde87lb64bansm4flcfs7vq9.apps.googleusercontent.com',
      scopes: ['email', 'profile'],
    );
    googleSignIn.disconnect();
    var googleUser = await googleSignIn.signIn();
    var accessTokenPrev = await googleUser!.authentication;
    googleAuthBox.token = accessTokenPrev.accessToken;
    String? error = await publishNewToken();
    if (error != null) {
      googleAuthBox.token = null;
      return error;
    }
    googleAuthBox.isEnable = true;
  }
  updateAuthPage!(null);
  return 'Operation succeed !';
}

/// Remove / Get the discord API access Token
Future<String> getDiscordToken() async {
  if (discordAuthBox.isEnable) {
    String? tokenSave = '${discordAuthBox.token}';
    discordAuthBox.token = null;
    String? error = await publishNewToken();
    if (error != null) {
      discordAuthBox.token = tokenSave;
      return error;
    }
    discordAuthBox.isEnable = false;
  } else {
    discordAuthBox.token = "BBBBB";

    /// CALL THE AUTH METHOD
    String? error = await publishNewToken();
    if (error != null) {
      discordAuthBox.token = null;
      return error;
    }
    discordAuthBox.isEnable = true;
  }
  updateAuthPage!(null);
  return 'Operation succeed !';
}

/// Publish the updated Auth Token to the server
Future<String?> publishNewToken() async {
  try {
    var response = await http.post(Uri.parse('http://$serverIp:8080/api/token'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ${userInformation!.token}',
        },
        body: jsonEncode(<String, dynamic>{
          'google': googleAuthBox.token != null ? googleAuthBox.token! : '',
          'discord': discordAuthBox.token != null ? discordAuthBox.token! : ''
        }));

    if (response.statusCode == 200) {
      userInformation = UserData.fromJson(jsonDecode(response.body)['data']);
      return null;
    } else {
      return response.body.toString();
    }
  } catch (err) {
    debugPrint(err.toString());
    return 'Error during auth process.';
  }
}
