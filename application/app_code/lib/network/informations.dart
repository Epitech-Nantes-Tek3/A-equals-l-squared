import 'package:flutter/material.dart';

String serverIp = '127.0.0.1';

Widget getHostConfigField() {
  return TextFormField(
      decoration: const InputDecoration(
        border: OutlineInputBorder(),
        labelText: 'Server IP address',
      ),
      initialValue: serverIp,
      onSaved: (String? value) {
        serverIp = value!;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      validator: (String? value) {
        return (value != null && value.length <= 6 && !value.contains('.'))
            ? 'Must be a valid ip address.'
            : null;
      });
}
