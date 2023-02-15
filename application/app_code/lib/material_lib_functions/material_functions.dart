import 'package:flutter/material.dart';

/// This function display our logo
Widget displayLogo(double size) {
  return Column(
    children: <Widget>[Image.asset('assets/icons/Area_Logo.png')],
  );
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

/// This function create a new ElevatedButton with the content of buttonContent (only this param is needed)
/// This function can take many parameter to modified the style of the ElevatedButton
ElevatedButton elevatedButtonArea(ElevatedButton buttonContent,
    {borderRadius = 0,
    borderColor = Colors.white,
    borderWith = 0,
    paddingVertical = 0,
    paddingHorizontal = 0}) {
  ElevatedButton newButton = ElevatedButton(
      onPressed: buttonContent.onPressed,
      style: ElevatedButton.styleFrom(
          padding: EdgeInsets.symmetric(
              vertical: paddingVertical, horizontal: paddingHorizontal),
          side: BorderSide(color: borderColor, width: borderWith),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
      child: buttonContent.child);
  return newButton;
}
