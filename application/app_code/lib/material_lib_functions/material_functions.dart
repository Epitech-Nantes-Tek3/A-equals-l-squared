import 'package:flutter/material.dart';

  /// This function display our logo
  Widget displayLogo(double size) {
    return Icon(size: size, Icons.apple);
  }

  Widget materialShadowForArea(Widget widget) {
    return Material(elevation: 5, shadowColor: Colors.black, child: widget);
  }
