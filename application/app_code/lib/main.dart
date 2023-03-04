import 'package:application/night_mod/night_mod.dart';
import 'package:application/router.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'A = L²',
      theme: ThemeData(
          fontFamily: 'Roboto-Bold',
          brightness: nightMod ? Brightness.dark : Brightness.light),
      routeInformationProvider: router.routeInformationProvider,
      routeInformationParser: router.routeInformationParser,
      routerDelegate: router.routerDelegate,
    );
  }
}
