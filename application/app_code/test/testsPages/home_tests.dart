import 'package:application/flutter_objects/user_data.dart';
import 'package:application/network/informations.dart';
import 'package:application/pages/home/home_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void homePageTest() {
  testWidgets('Some test with the home page', (WidgetTester tester) async {
    userInformation = UserData(
        userName: 'testing',
        email: 'testing',
        isAdmin: false,
        createdAt: DateTime(1));
    await tester.pumpWidget(
      MaterialApp(
        title: 'Testing app',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        ),
        home: const HomePage(),
      ),
    );

    expect(find.text("All Areas"), findsOneWidget);

    /// ADD NEW TEST HERE
  });
}
