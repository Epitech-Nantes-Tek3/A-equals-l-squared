import 'package:flutter/material.dart';

/// This function display our logo
Widget displayLogo(double size) {
  return Column(
    children: <Widget>[Image.asset('assets/icons/Area_Logo.png')],
  );
}

/// Return our blue color Hex : 06A1E4
Color getOurBlueAreaColor(double opacity) {
  return Color.fromRGBO(6, 161, 228, opacity);
}

/// Return our green color Hex : 16FCBC
Color getOurGreenAreaColor(double opacity) {
  return Color.fromRGBO(22, 252, 188, opacity);
}

/// This function create a new ElevatedButton with the content of buttonContent
/// This function can take many parameter to modified the style of the ElevatedButton but by it used default values of front design
Widget materialElevatedButtonArea(ElevatedButton buttonContent, bool isShadowNeeded,
    {borderColor = Colors.white,
    primaryColor = Colors.white,
    double borderRadius = 30,
    double borderWith = 0,
    double paddingVertical = 20,
    double paddingHorizontal = 20}) {
  ElevatedButton newButton = ElevatedButton(
      onPressed: buttonContent.onPressed,
      style: ElevatedButton.styleFrom(
          primary: primaryColor,
          padding: EdgeInsets.symmetric(
              vertical: paddingVertical, horizontal: paddingHorizontal),
          side: BorderSide(color: borderColor, width: borderWith),
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(borderRadius)),
          shadowColor: isShadowNeeded ? Colors.black : Colors.transparent,
          elevation: isShadowNeeded ? 5 : 0),
      child: buttonContent.child);
  if (isShadowNeeded) {
    return materialShadowForArea(newButton);
  }
  return newButton;
}
