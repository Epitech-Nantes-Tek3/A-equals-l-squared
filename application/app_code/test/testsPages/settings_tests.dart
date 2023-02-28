import 'package:application/network/informations.dart';
import 'package:application/pages/settings/settings_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void settingsPageTest() {
  testWidgets('Some test with the settings page', (WidgetTester tester) async {
    userInformation = null;
    await tester.pumpWidget(
      MaterialApp(
        title: 'Testing app',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        ),
        home: const SettingsPage(),
      ),
    );

    await tester.pump();
    expect(find.text("Settings Page"), findsOneWidget);

    /// ADD NEW TEST HERE
  });
}
