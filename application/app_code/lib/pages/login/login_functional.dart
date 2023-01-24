import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

bool isAuth = false;

void goToLoginPage(BuildContext context) {
  isAuth = false;
  context.go('/');
}
