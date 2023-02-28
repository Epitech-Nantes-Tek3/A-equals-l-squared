import 'package:application/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'testsFlutterObjects/action_data_tests.dart';
import 'testsFlutterObjects/area_data_tests.dart';
import 'testsFlutterObjects/dynamic_parameter_data_tests.dart';
import 'testsFlutterObjects/error_data_tests.dart';
import 'testsFlutterObjects/parameter_data_tests.dart';
import 'testsFlutterObjects/reaction_data_tests.dart';
import 'testsFlutterObjects/service_data_tests.dart';
import 'testsFlutterObjects/user_data_tests.dart';

void templateFunction() {
  testWidgets('Just a basic template test', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    /// Launch the main page of the project

    expect(find.text('You have pushed the button this many times:'),
        findsOneWidget);

    /// Find a text containing this
    expect(find.text('1'), findsNothing);

    /// Expected no widget containing '1'

    await tester.tap(find.byIcon(Icons.add));

    /// Click on a button containing the 'add' icon
    await tester.pump();

    /// Update the page (Do it after each action performing a set state.
  });
}

void flutterObjectTest() {
  actionDataTest();
  areaDataTest();
  dynamicParameterDataTest();
  errorDataTest();
  parameterDataTest();
  reactionDataTest();
  serviceDataTest();
  userDataTest();
}

void main() {
  flutterObjectTest();
}
