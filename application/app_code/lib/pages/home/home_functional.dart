import 'package:application/network/informations.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Navigation function -> Go to Home page
void goToHomePage(BuildContext context) {
  if (userInformation != null) {
    context.go('/');
    return;
  }
  context.go('/home');
}
