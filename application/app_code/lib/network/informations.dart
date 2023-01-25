import 'package:flutter/material.dart';

/// Global variable referencing the server ip address
String serverIp = '127.0.0.1';

/// Function returning a field widget to update the server ip address
Widget getHostConfigField() {
  return TextFormField(
      decoration: const InputDecoration(
        border: OutlineInputBorder(),
        labelText: 'Server IP address',
      ),
      initialValue: serverIp,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      validator: (String? value) {
        if (value != null && value.length <= 6 && !value.contains('.')) {
          return 'Must be a valid ip address.';
        }
        serverIp = value!;
        return null;
      });
}
