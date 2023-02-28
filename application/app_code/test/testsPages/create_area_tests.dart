import 'package:application/flutter_objects/user_data.dart';
import 'package:application/network/informations.dart';
import 'package:application/pages/create_area/create_area_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void createAreaPageTest() {
  testWidgets('Some test with the create Area page',
      (WidgetTester tester) async {
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
        home: const CreateAreaPage(),
      ),
    );

    await tester.pump();
    expect(find.text(''), findsWidgets);

    /// ADD NEW TEST HERE
  });
}
