/// This class is the UserData class.
/// It contains all information about a UserData
class UserData {
  final String userName;
  final String token;
  final bool isAdmin;
  final String email;
  final DateTime createdAt;

  /// Constructor of the UserData class
  const UserData({
    required this.userName,
    required this.email,
    required this.token,
    required this.isAdmin,
    required this.createdAt,
  });

  /// Convert a json map into the class
  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
        userName: json['user']['username'],
        email: json['user']['email'],
        isAdmin: json['user']['isAdmin'],
        createdAt: json["user"]["createdAt"],
        token: json["token"]);
  }
}
