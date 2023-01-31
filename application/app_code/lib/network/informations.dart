import 'package:flutter/material.dart';

import '../flutter_objects/user_data.dart';

/// Global variable referencing the server ip address
String serverIp = '127.0.0.1';

/// Global variable referencing the user network data
UserData? userInformation;

/// Function returning a field widget to update the server ip address
Widget getHostConfigField() {
  return TextFormField(
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.all(20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5.0),
        ),
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
