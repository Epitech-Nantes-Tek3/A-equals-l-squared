import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../network/informations.dart';
import '../home/home_functional.dart';

/// Navigation function -> Go to Login page
void goToLoginPage(BuildContext context, bool fromSettings) {
  userInformation = null;
  logout = true;
  if (updatePage != null && fromSettings) {
    updatePage!();
  }
  context.go('/');
}
