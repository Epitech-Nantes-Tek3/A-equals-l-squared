import 'package:flutter/material.dart';

/// This class is the UserData class.
/// It contains all information about an UserData
class UserData {
  String userName;
  String? token;
  bool isAdmin;
  String email;
  DateTime createdAt;

  /// Constructor of the UserData class
  UserData({
    required this.userName,
    required this.email,
    this.token,
    required this.isAdmin,
    required this.createdAt,
  });

  /// Function to display user name
  Widget? displayUserName() {
      return Column(
        children: <Widget>[
          Text(userName),
        ],
      );
  }

  /// Function to display user email
  Widget? displayUserEmail() {
    return Column(
      children: <Widget>[
        Text(userName),
      ],
    );
  }

  /// Function to display if an user is admin
  Widget? displayIsUserIsAdmin() {
    if (isAdmin) {
      return Column(
        children: const <Widget>[
          Text('Admin'),
        ],
      );
    } else {
      return Column(
        children: const <Widget>[
          Text("Not Admin"),
        ],
      );
    }
  }

  /// Convert a json map into the class
  factory UserData.fromJson(Map<String, dynamic> json) {
    late bool isToken;
    try {
      json['token'];
      isToken = true;
    } catch (err) {
      isToken = false;
    }
    return UserData(
        userName: json['user']['username'],
        email: json['user']['email'],
        isAdmin: json['user']['isAdmin'],
        createdAt: DateTime.parse(json['user']['createdAt']),
        token: (isToken ? json['token'] : null));
  }
}
