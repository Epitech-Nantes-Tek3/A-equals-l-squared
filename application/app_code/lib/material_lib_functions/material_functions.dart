import 'package:flutter/material.dart';

/// This function display our logo
Widget displayLogo(double size) {
  return Icon(size: size, Icons.apple);
}

/// Add our shadow on a Widget
Widget materialShadowForArea(Widget widget) {
  return Material(elevation: 5, shadowColor: Colors.black, child: widget);
}

/// Return our blue color Hex : 06A1E4
Color getOurBlueAreaColor(double opacity) {
  return Color.fromRGBO(6, 161, 228, opacity);
}

/// Return our green color Hex : 16FCBC
Color getOurGreenAreaColor(double opacity) {
  return Color.fromRGBO(22, 252, 188, opacity);
}
