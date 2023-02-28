import 'package:application/network/informations.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../create_area/create_area_functional.dart';

/// Navigation function -> Go to UpdateAreas page
void goToUpdateAreaPage(BuildContext context) {
  if (userInformation == null) {
    context.go('/');
    return;
  }
  changeType = 'update';
  context.go('/create_area');
}
