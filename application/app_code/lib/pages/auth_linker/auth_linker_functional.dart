import 'dart:convert';

import 'package:application/network/informations.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';
import 'package:go_router/go_router.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

import '../../flutter_objects/user_data.dart';
import '../../material_lib_functions/material_functions.dart';

/// Function pointer needed to update the Auth Page
Function? updateAuthPage;

/// Navigation function -> Go to AuthLinker page
void goToAuthLinkerPage(BuildContext context) {
  if (userInformation == null) {
    context.go('/');
    return;
  }
  context.go('/auth_linker');
}

/// This class is the AuthBox class.
/// It contains all information about a Auth service
class AuthBox {
  String authName;
  String authDescription;
  bool isEnable;
  Function action;
  String? token;

  /// Constructor af the AuthBox class
  AuthBox(
      {required this.authName,
      required this.authDescription,
      required this.isEnable,
      required this.action,
      this.token});

  /// Return a visual representation of the AuthBox
  Widget display(BuildContext context) {
    String iconGiven = "assets/icons/Area_Logo.png";
    if (userInformation!.userToken != null) {
      if (authName == 'Google') {
        token = userInformation!.userToken!.googleToken;
        iconGiven = "assets/icons/gmail.png";
      }
      if (authName == 'Discord') {
        token = userInformation!.userToken!.discordToken;
        iconGiven = "assets/icons/discord.png";
      }
      if (authName == 'Reddit') {
        token = userInformation!.userToken!.redditToken;
        iconGiven = "assets/icons/reddit.png";
      }
      if (authName == 'Deezer') {
        token = userInformation!.userToken!.deezerToken;
        iconGiven = "assets/icons/deezer.png";
      }
      isEnable = token == null ? false : true;
    }
    return materialElevatedButtonArea(
      ElevatedButton(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
            side: const BorderSide(width: 3),
          ),
          onPressed: () {
            if (updateAuthPage != null) {
              updateAuthPage!(action);
            }
          },
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Image.asset(
                    iconGiven,
                    height: 40,
                    width: 40,
                  ),
                  Row(
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            authName,
                            style: TextStyle(
                                color: Theme.of(context).secondaryHeaderColor),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          Text(
                            authDescription,
                            style: TextStyle(
                                color: Theme.of(context).secondaryHeaderColor),
                          )
                        ],
                      )
                    ],
                  ),
                  Icon(
                    isEnable ? Icons.check_box : Icons.check_box_outline_blank,
                    color: isEnable
                        ? Colors.lightGreen
                        : Theme.of(context).secondaryHeaderColor,
                  )
                ],
              ),
            ],
          )),
      context,
      sizeOfButton: 1,
      isShadowNeeded: true,
    );
  }
}

/// The google service authBox
AuthBox googleAuthBox = AuthBox(
    authName: "Google",
    authDescription: "Used for all Gmail interaction",
    isEnable: false,
    action: getGoogleToken);

/// The discord service authBox
AuthBox discordAuthBox = AuthBox(
    authName: "Discord",
    authDescription: "Used for all Discord interaction",
    isEnable: false,
    action: getDiscordToken);

/// The discord invite service authBox
AuthBox discordInviteAuthBox = AuthBox(
    authName: "Invite the discord bot",
    authDescription: "Add our discord bot in your server",
    isEnable: true,
    token: "",
    action: inviteDiscordBot);

/// The reddit service authBox
AuthBox redditAuthBox = AuthBox(
    authName: "Reddit",
    authDescription: "Used for all Reddit interaction",
    isEnable: false,
    action: getRedditToken);

/// The deezer service authBox
AuthBox deezerAuthBox = AuthBox(
    authName: "Deezer",
    authDescription: "Used for all Deezer interaction",
    isEnable: false,
    action: getDeezerToken);

/// Remove / Get the Google API access token
Future<String> getGoogleToken() async {
  if (googleAuthBox.isEnable) {
    String? tokenSave = '${googleAuthBox.token}';
    googleAuthBox.token = null;
    String? error = await publishNewToken();
    if (error != null) {
      googleAuthBox.token = tokenSave;
      return error;
    }
    googleAuthBox.isEnable = false;
  } else {
    GoogleSignIn googleSignIn = GoogleSignIn(
      clientId:
          '770124443966-jh4puirdfde87lb64bansm4flcfs7vq9.apps.googleusercontent.com',
      scopes: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ],
    );
    googleSignIn.disconnect();
    var googleUser = await googleSignIn.signIn();
    var accessTokenPrev = await googleUser!.authentication;
    googleAuthBox.token = accessTokenPrev.accessToken;
    String? error = await publishNewToken();
    if (error != null) {
      googleAuthBox.token = null;
      return error;
    }
    googleAuthBox.isEnable = true;
  }
  updateAuthPage!(null);
  return 'Operation succeed !';
}

/// Remove / Get the discord API access Token
Future<String> getDiscordToken() async {
  if (discordAuthBox.isEnable) {
    String? tokenSave = '${discordAuthBox.token}';
    discordAuthBox.token = null;
    String? error = await publishNewToken();
    if (error != null) {
      discordAuthBox.token = tokenSave;
      return error;
    }
    discordAuthBox.isEnable = false;
  } else {
    String clientId = "1071440720516354118";

    final url = Uri.https('discord.com', '/api/oauth2/authorize', {
      'response_type': 'code',
      'client_id': clientId,
      'redirect_uri':
          !kIsWeb ? 'https://www.test.com' : 'http://localhost:8081/auth.html',
      'scope': 'identify guilds',
    });

    final result = await FlutterWebAuth2.authenticate(
        url: url.toString(), callbackUrlScheme: !kIsWeb ? 'https' : 'http');

    final code = Uri.parse(result).queryParameters['code'];

    final response = await http
        .post(Uri.parse('https://discord.com/api/oauth2/token'), body: {
      'client_id': clientId,
      'redirect_uri':
          !kIsWeb ? 'https://www.test.com' : 'http://localhost:8081/auth.html',
      'grant_type': 'authorization_code',
      'code': code,
      'client_secret': "Qew25p5oA3pDMnOxpX0G2-ZNyTO2mz_n"
    }, headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    final accessToken = jsonDecode(response.body)['access_token'] as String;

    discordAuthBox.token = accessToken;

    String? error = await publishNewToken();
    if (error != null) {
      discordAuthBox.token = null;
      return error;
    }
    discordAuthBox.isEnable = true;
  }
  updateAuthPage!(null);
  return 'Operation succeed !';
}

/// Remove / Get the Reddit API access Token
Future<String> getRedditToken() async {
  if (redditAuthBox.isEnable) {
    String? tokenSave = '${redditAuthBox.token}';
    redditAuthBox.token = null;
    String? error = await publishNewToken();
    if (error != null) {
      redditAuthBox.token = tokenSave;
      return error;
    }
    redditAuthBox.isEnable = false;
  } else {
    String clientId = "7P3NMqftCBgr7H-XaPUbNg";
    String state = 'blablablarea';

    final url = Uri.https('reddit.com', '/api/v1/authorize', {
      'response_type': 'code',
      'client_id': clientId,
      'redirect_uri':
          !kIsWeb ? 'https://www.test.com' : 'http://localhost:8081/auth.html',
      'duration': 'permanent',
      'state': state,
      'scope':
          'identity edit history mysubreddits privatemessages read save submit subscribe vote'
    });
    final result = await FlutterWebAuth2.authenticate(
        url: url.toString(), callbackUrlScheme: !kIsWeb ? 'https' : 'http');

    final code = Uri.parse(result).queryParameters['code']!;

    final response = await getRedditTokenWithCode(code);

    final accessToken = response;

    redditAuthBox.token = accessToken;

    String? error = await publishNewToken();
    if (error != null) {
      redditAuthBox.token = null;
      return error;
    }
    redditAuthBox.isEnable = true;
  }
  updateAuthPage!(null);
  return 'Operation succeed !';
}

/// Invite the Discord bot to the user server
Future<String> inviteDiscordBot() async {
  await launchUrl(
      Uri.parse(kIsWeb
          ? "https://discord.com/oauth2/authorize?client_id=1066384923231006741&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Fauth.html&response_type=code&scope=identify%20guilds%20bot%20guilds.members.read%20messages.read%20email"
          : "https://discord.com/oauth2/authorize?client_id=1066384923231006741&permissions=8&redirect_uri=https%3A%2F%2Fwww.test.com&response_type=code&scope=identify%20guilds%20bot%20guilds.members.read%20messages.read%20email"),
      mode: LaunchMode.externalApplication);
  return 'Thanks for adding our bot to your server !';
}

/// Get the Reddit API access Token with the code
Future<String> getRedditTokenWithCode(String code) async {
  try {
    var response =
        await http.post(Uri.parse('http://$serverIp:8080/api/code/reddit'),
            headers: <String, String>{
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer ${userInformation!.token}',
            },
            body: jsonEncode(<String, dynamic>{
              'code': code,
            }));

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['data']['access_token'];
    } else {
      return response.body.toString();
    }
  } catch (err) {
    debugPrint(err.toString());
    return 'Error during auth process.';
  }
}

/// Publish the updated Auth Token to the server
Future<String?> publishNewToken() async {
  try {
    var response = await http.post(Uri.parse('http://$serverIp:8080/api/token'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ${userInformation!.token}',
        },
        body: jsonEncode(<String, dynamic>{
          'google': googleAuthBox.token != null ? googleAuthBox.token! : '',
          'discord': discordAuthBox.token != null ? discordAuthBox.token! : '',
          'reddit': redditAuthBox.token != null ? redditAuthBox.token! : '',
          'deezer': deezerAuthBox.token != null ? deezerAuthBox.token! : ''
        }));

    if (response.statusCode == 200) {
      userInformation = UserData.fromJson(jsonDecode(response.body)['data']);
      return null;
    } else {
      return response.body.toString();
    }
  } catch (err) {
    debugPrint(err.toString());
    return 'Error during auth process.';
  }
}

Future<String> getDeezerToken() async {
  if (deezerAuthBox.isEnable) {
    String? tokenSave = '${deezerAuthBox.token}';
    deezerAuthBox.token = null;
    String? error = await publishNewToken();
    if (error != null) {
      deezerAuthBox.token = tokenSave;
      return error;
    }
    deezerAuthBox.isEnable = false;
  } else {
    String appId = "581644";
    String secret = "2cf8a215785c22ac97469d251cef7667";

    final url = Uri.https('connect.deezer.com', '/oauth/auth.php', {
      'app_id': appId,
      'redirect_uri': 'http://localhost:8081/auth.html',
      'perms':
          'basic_access,email,offline_access,manage_library,manage_community,delete_library,listening_history',
    });

    final result = await FlutterWebAuth2.authenticate(
        url: url.toString(), callbackUrlScheme: 'http');

    String code = Uri.parse(result).queryParameters['code']!;

    final response = await getDeezerTokenWithCode(appId, secret, code);
    final accessToken = response;

    deezerAuthBox.token = accessToken;

    String? error = await publishNewToken();
    if (error != null) {
      deezerAuthBox.token = null;
      return error;
    }
    deezerAuthBox.isEnable = true;
    var responseId = await http.post(
        Uri.parse('http://$serverIp:8080/api/services/deezer/fillUserId'),
        headers: <String, String>{
          'Authorization': 'Bearer ${userInformation!.token}',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: jsonEncode(<String, dynamic>{}));
    if (responseId.statusCode != 200) {
      return responseId.body.toString();
    }
  }
  updateAuthPage!(null);
  return 'Operation succeed !';
}

Future<String> getDeezerTokenWithCode(
    String appId, String secret, String code) async {
  try {
    var response =
        await http.post(Uri.parse('http://$serverIp:8080/api/code/deezer'),
            headers: <String, String>{
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer ${userInformation!.token}',
            },
            body: jsonEncode(<String, dynamic>{
              'app_id': appId,
              'secret': secret,
              'code': code,
            }));

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['data']['access_token'];
    } else {
      return response.body.toString();
    }
  } catch (err) {
    debugPrint(err.toString());
    return 'Error during auth process.';
  }
}
