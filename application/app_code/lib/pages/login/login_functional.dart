import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../network/informations.dart';
import '../home/home_functional.dart';

/// Navigation function -> Go to Login page
void goToLoginPage(BuildContext context) {
  userInformation = null;
  logout = true;
  context.go('/');
}
