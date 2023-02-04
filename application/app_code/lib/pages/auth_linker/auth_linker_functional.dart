import 'dart:convert';

import 'package:application/network/informations.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

import '../../flutter_objects/user_data.dart';
import '../../network/informations.dart';

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

class AuthBox {
  String authName;
  String authDescription;
  bool isEnable;
  Function action;
  String? token;

  AuthBox(
      {required this.authName,
      required this.authDescription,
      required this.isEnable,
      required this.action});

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

AuthBox googleAuthBox = AuthBox(
    authName: "Google",
    authDescription: "Used for all Gmail interaction",
    isEnable: false,
    action: getGoogleToken);

AuthBox discordAuthBox = AuthBox(
    authName: "Discord",
    authDescription: "Used for all Discord interaction",
    isEnable: false,
    action: getDiscordToken);

Future<String> getGoogleToken() async {
  if (googleAuthBox.isEnable) {
    print('Deactivation');
    String? tokenSave = '${googleAuthBox.token}';
    googleAuthBox.token = null;
    String? error = await publishNewToken();
    if (error != null) {
      googleAuthBox.token = tokenSave;
      return error;
    }
    googleAuthBox.isEnable = false;
  } else {
    print('Activation !');
    GoogleSignIn googleSignIn = GoogleSignIn(
      clientId:
          '770124443966-jh4puirdfde87lb64bansm4flcfs7vq9.apps.googleusercontent.com',
      scopes: ['email', 'profile'],
    );
    googleSignIn.disconnect();
    var googleUser = await googleSignIn.signIn();
    var accessTokenPrev = await googleUser!.authentication;
    print(accessTokenPrev.accessToken);
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

Future<String> getDiscordToken() async {
  if (discordAuthBox.isEnable) {
    print('Deactivation');
    String? tokenSave = '${discordAuthBox.token}';
    discordAuthBox.token = null;
    String? error = await publishNewToken();
    if (error != null) {
      discordAuthBox.token = tokenSave;
      return error;
    }
    discordAuthBox.isEnable = false;
  } else {
    print('Activation !');
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
