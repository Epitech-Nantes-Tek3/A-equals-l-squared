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

/// To know if we are on desktop
bool isDesktop(BuildContext context) =>
    MediaQuery.of(context).size.width >= 600;

/// To know if we are on mobile
bool isMobile(BuildContext context) => MediaQuery.of(context).size.width < 600;

/// This function create a new ElevatedButton with the content of buttonContent
/// This function can take many parameter to modified the style of the ElevatedButton but by it used default values of front design
Widget materialElevatedButtonArea(
    ElevatedButton buttonContent, BuildContext? context,
    {sizeOfButton = 3,
    bool isShadowNeeded = false,
    borderColor = Colors.grey,
    primaryColor = Colors.grey,
    double borderRadius = 10,
    double borderWith = 0,
    double paddingVertical = 10,
    double paddingHorizontal = 10}) {
  Widget newButton = SizedBox(
    width: context != null
        ? (MediaQuery.of(context).size.width) >= 600
            ? (600 / sizeOfButton)
            : (MediaQuery.of(context).size.width / sizeOfButton)
        : 10,
    child: ElevatedButton(
        onPressed: buttonContent.onPressed,
        style: ElevatedButton.styleFrom(
            primary: primaryColor == Colors.grey && context != null
                ? Theme.of(context).primaryColor
                : primaryColor,
            padding: EdgeInsets.symmetric(
                vertical: paddingVertical, horizontal: paddingHorizontal),
            side: BorderSide(
                color: borderColor == Colors.grey && context != null
                    ? Theme.of(context).primaryColor
                    : borderColor,
                width: borderWith),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(borderRadius)),
            shadowColor: isShadowNeeded ? Colors.black : Colors.transparent,
            elevation: isShadowNeeded ? 3 : 0),
        key: buttonContent.key,
        child: buttonContent.child),
  );
  return newButton;
}
