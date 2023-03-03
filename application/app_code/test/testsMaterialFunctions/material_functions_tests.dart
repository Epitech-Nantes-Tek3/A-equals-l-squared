import 'package:application/material_lib_functions/material_functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void materialFunctionsTest() {
  testWidgets('Some test with the material functions',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        title: 'Testing app',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        ),
        home: Center(
          child: materialElevatedButtonArea(
              ElevatedButton(
                onPressed: () {},
                key: const Key('TestingButton'),
                child: const Text('testing'),
              ),
              null),
        ),
      ),
    );

    expect(find.byKey(const Key("TestingButton")), findsOneWidget);

    /// ADD NEW TEST HERE
  });
}
