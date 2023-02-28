import 'package:application/network/informations.dart';
import 'package:application/pages/service_list/service_list_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void serviceListPageTest() {
  testWidgets('Some test with the service list page',
      (WidgetTester tester) async {
    userInformation = null;
    await tester.pumpWidget(
      MaterialApp(
        title: 'Testing app',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        ),
        home: const ServiceListPage(),
      ),
    );

    await tester.pump();
    expect(find.text("Service List page"), findsOneWidget);

    /// ADD NEW TEST HERE
  });
}
