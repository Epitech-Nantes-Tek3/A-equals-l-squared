import 'package:application/network/informations.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

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

  AuthBox(
      {required this.authName,
      required this.authDescription,
      required this.isEnable,
      required this.action});

  Widget display() {
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

Future<String> getGoogleToken() async {
  print('Actioned google token');
  return 'Google token !';
}
