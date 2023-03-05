import 'package:application/flutter_objects/area_data.dart';
import 'package:application/network/informations.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Current area in creation
AreaData? createdArea;

/// Current area operation type
String changeType = 'Create';

/// Navigation function -> Go to CreateAreas page
void goToCreateAreaPage(BuildContext context) {
  if (userInformation == null) {
    context.go('/');
    return;
  }
  createdArea = AreaData(
      id: '',
      name: 'Default',
      userId: '',
      actionList: [],
      reactionList: [],
      isEnable: true,
      logicalGate: 'OR',
      primaryColor: '#B3FFFFFF',
      secondaryColor: '#000000',
      iconPath: '',
      updatedAt: DateTime(1));
  changeType = 'create';
  context.go('/create_area');
}
