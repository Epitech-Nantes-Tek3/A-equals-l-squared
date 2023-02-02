import 'package:application/pages/service_list/service_list_page.dart';
import 'package:flutter/material.dart';

import '../home/home_functional.dart';

class ServiceListPageState extends State<ServiceListPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text('Welcome to Service List page'),
          ElevatedButton(
            key: const Key('ServiceListHomeButton'),
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
