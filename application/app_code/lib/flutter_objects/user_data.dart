/// This class is the UserData class.
/// It contains all information about an UserData
class UserData {
  String userName;
  String? token;
  bool isAdmin;
  String email;
  DateTime createdAt;
  Token? userToken;

  /// Constructor of the UserData class
  UserData(
      {required this.userName,
      required this.email,
      this.token,
      required this.isAdmin,
      required this.createdAt,
      this.userToken});

  /// Convert a json map into the class
  factory UserData.fromJson(Map<String, dynamic> json) {
    late bool isToken;
    try {
      json['token'];
      isToken = true;
    } catch (err) {
      isToken = false;
    }

    Token? userToken;
    try {
      userToken = Token.fromJson(json['user']['Token'][0]);
    } catch (err) {
      userToken = null;
    }

    return UserData(
        userName: json['user']['username'],
        email: json['user']['email'],
        isAdmin: json['user']['isAdmin'],
        createdAt: DateTime.parse(json['user']['createdAt']),
        token: (isToken ? json['token'] : null),
        userToken: userToken);
  }
}

/// This class is the Token class
/// It contains all information about user Token
class Token {
  String id;
  String? googleToken;
  String? discordToken;
  String userId;

  /// Constructor of the Token class
  Token({
    required this.id,
    required this.userId,
    this.googleToken,
    this.discordToken,
  });

  /// Convert a json map into a Token class
  factory Token.fromJson(Map<String, dynamic> json) {
    String? googleToken;
    String? discordToken;

    try {
      googleToken = json['googleToken'];
    } catch (err) {
      googleToken = null;
    }

    try {
      discordToken = json['discordToken'];
    } catch (err) {
      discordToken = null;
    }

    return Token(
        id: json['id'],
        userId: json['userId'],
        googleToken: googleToken,
        discordToken: discordToken);
  }
}
