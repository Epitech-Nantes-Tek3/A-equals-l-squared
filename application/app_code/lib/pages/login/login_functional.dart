import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Will be removed when User class will be implemented
bool isAuth = false;

/// Will be removed when User class will be implemented
String? token;

/// Navigation function -> Go to Login page
void goToLoginPage(BuildContext context) {
  isAuth = false;
  token = null;
  context.go('/');
}
