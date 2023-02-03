import 'package:application/flutter_objects/area_data.dart';
import 'package:application/flutter_objects/service_data.dart';
import 'package:application/network/informations.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Current area in creation
AreaData? createdArea;

/// Content of the created area
List<ServiceData> createdAreaContent = <ServiceData>[];

/// Navigation function -> Go to CreateAreas page
void goToCreateAreaPage(BuildContext context) {
  if (userInformation == null) {
    context.go('/');
    return;
  }
  context.go('/create_area');
}
