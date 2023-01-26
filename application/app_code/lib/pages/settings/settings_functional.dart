import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../login/login_functional.dart';

/// Navigation function -> Go to Settings page
void goToSettingsPage(BuildContext context) {
  if (!isAuth) {
    context.go('/');
    return;
  }
  context.go('/settings');
}
