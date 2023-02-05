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
      userToken = Token.fromJson(json['user']);
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
  String? googleToken;
  String? discordToken;

  /// Constructor of the Token class
  Token({
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

    return Token(googleToken: googleToken, discordToken: discordToken);
  }
}
