import 'package:application/network/informations.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Navigation function -> Go to ServiceList page
void goToServiceListPage(BuildContext context) {
  if (userInformation == null) {
    context.go('/');
    return;
  }
  context.go('/service_list');
}
