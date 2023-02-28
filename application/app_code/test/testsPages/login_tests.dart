import 'package:application/network/informations.dart';
import 'package:application/pages/login/login_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void loginPageTest() {
  testWidgets('Some test with the login page', (WidgetTester tester) async {
    userInformation = null;
    await tester.pumpWidget(
      MaterialApp(
        title: 'Testing app',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        ),
        home: const LoginPage(),
      ),
    );

    await tester.pump();
    expect(find.byKey(const Key("SendLoginButton")), findsOneWidget);

    /// ADD NEW TEST HERE
  });
}
