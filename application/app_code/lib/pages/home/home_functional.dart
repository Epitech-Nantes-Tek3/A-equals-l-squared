import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../login/login_functional.dart';

void goToHomePage(BuildContext context) {
  if (!isAuth) {
    context.go('/');
    return;
  }
  context.go('/home');
}
