import 'package:application/router.dart';
import 'package:flutter/material.dart';

import '../../material_lib_functions/material_functions.dart';

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
      ),
      routeInformationProvider: router.routeInformationProvider,
      routeInformationParser: router.routeInformationParser,
      routerDelegate: router.routerDelegate,
    );
  }
}
