import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../network/informations.dart';

/// Navigation function -> Go to Login page
void goToLoginPage(BuildContext context) {
  userInformation = null;
  context.go('/');
}
