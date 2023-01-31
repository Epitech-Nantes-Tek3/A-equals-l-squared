import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Navigation function -> Go to Home page
void goToHomePage(BuildContext context) {
  updateAllFlutterObject(context);
  context.go('/');
}

/// Update all the Flutter object and call the api
void updateAllFlutterObject(BuildContext context) async {
  print('Update');
}
