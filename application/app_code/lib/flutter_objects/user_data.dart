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

  /// Convert a json map into the class
  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
        userName: json['user']['username'],
        email: json['user']['email'],
        isAdmin: json['user']['isAdmin'],
        createdAt: json['user']['createdAt'],
        token: json['token']);
  }
}
