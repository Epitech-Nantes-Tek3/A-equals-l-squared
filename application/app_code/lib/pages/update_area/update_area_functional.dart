import 'package:application/flutter_objects/area_data.dart';
import 'package:application/network/informations.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Current updating area
AreaData? updatingArea;

/// Navigation function -> Go to UpdateAreas page
void goToUpdateAreaPage(BuildContext context) {
  if (userInformation == null) {
    context.go('/');
    return;
  }
  context.go('/update_area');
}
