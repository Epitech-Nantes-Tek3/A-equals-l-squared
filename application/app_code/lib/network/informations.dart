import 'package:flutter/material.dart';

String serverIp = '127.0.0.1';

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
