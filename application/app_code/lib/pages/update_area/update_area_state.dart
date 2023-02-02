import 'package:application/pages/update_area/update_area_functional.dart';
import 'package:application/pages/update_area/update_area_page.dart';
import 'package:flutter/material.dart';

import '../home/home_functional.dart';

class UpdateAreaPageState extends State<UpdateAreaPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text('Welcome to Update Area page'),
          if (updatingArea != null) updatingArea!.display(true),
          ElevatedButton(
            key: const Key('UpdateAreaHomeButton'),
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
