import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

bool isAuth = false;

/// Will be removed when User class will be implemented
String? token;

void goToLoginPage(BuildContext context) {
  isAuth = false;
  token = null;
  print('eee');
  context.go('/');
}
