import 'package:application/network/informations.dart';
import 'package:application/pages/signup/signup_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void signupPageTest() {
  testWidgets('Some test with the signup page', (WidgetTester tester) async {
    userInformation = null;
    await tester.pumpWidget(
      MaterialApp(
        title: 'Testing app',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        ),
        home: const SignupPage(),
      ),
    );

    await tester.pump();
    expect(find.text("Welcome to Signup page !"), findsOneWidget);

    /// ADD NEW TEST HERE
  });
}
