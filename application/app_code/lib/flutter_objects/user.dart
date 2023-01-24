class User {

  final String userName;
  final String token;
  final bool isAdmin;
  final String email;
  final DateTime createdAt;

  const User({
    required this.userName,
    required this.email,
    required this.token,
    required this.isAdmin,
    required this.createdAt,
  });
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userName: json['user']['username'],
      email: json['user']['email'],
      isAdmin: json['user']['isAdmin'],
      createdAt: json["user"]["createdAt"],
      token: json["token"]
    );
  }
}