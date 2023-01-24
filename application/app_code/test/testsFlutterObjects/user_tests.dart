import 'package:application/flutter_objects/user.dart';
import 'package:application/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void templateFunction() {
  testWidgets('Just a basic template test', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    /// Launch the main page of the project

    expect(find.text('You have pushed the button this many times:'),
        findsOneWidget);

    /// Find a text containing this
    Map<String, dynamic> json = {
      "status": "success",
      "data": {
        "message": "Account created.",
        "user": {
          "id": "42",
          "username": "paupaul",
          "email": "paupaul@epitech.eu",
          "password": "beurk",
          "isAdmin": false,
          "createdAt": "2023-01-24T08:53:04.687Z"
        },
        "token": "tokentest"
      },
      "statusCode": 201
    };
    User user = User.fromJson(json);
    expect(user.userName, "paupaul");
    expect(user.email, "paupaul@epitech.eu");
    expect(user.isAdmin, false);
    expect(user.createdAt, "2023-01-24T08:53:04.687Z");
    expect(user.token, "tokentest");

    /// Expected no widget containing '1'

    await tester.tap(find.byIcon(Icons.add));

    /// Click on a button containing the 'add' icon
    await tester.pump();

    /// Update the page (Do it after each action performing a set state.
  });
}

void loginPageTest() {
  testWidgets('Check the navigation between two page',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('Login page !'), findsOneWidget);
    await tester.tap(find.byKey(const Key('GoHomeButton')));
    await tester.pumpAndSettle();
    expect(find.text('Home page !'), findsOneWidget);
  });
}

void main() {
  loginPageTest();
}
