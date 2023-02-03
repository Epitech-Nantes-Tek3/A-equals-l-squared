import 'package:application/pages/create_area/create_area_page.dart';
import 'package:flutter/material.dart';

import '../home/home_functional.dart';

class CreateAreaPageState extends State<CreateAreaPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text('Welcome to Create Area page'),
          ElevatedButton(
            key: const Key('CreateAreaHomeButton'),
            onPressed: () {
              setState(() {
                goToHomePage(context);
              });
            },
            child: const Text('Go Home'),
          ),
        ],
      ),
    ));
  }
}
