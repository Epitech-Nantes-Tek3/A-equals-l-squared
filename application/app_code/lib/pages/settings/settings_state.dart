import 'dart:convert';

import 'package:application/flutter_objects/news_letter_data.dart';
import 'package:application/language/language.dart';
import 'package:application/material_lib_functions/material_functions.dart';
import 'package:application/network/informations.dart';
import 'package:application/night_mod/night_mod.dart';
import 'package:application/pages/settings/settings_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../flutter_objects/action_data.dart';
import '../../flutter_objects/area_data.dart';
import '../../flutter_objects/parameter_data.dart';
import '../../flutter_objects/reaction_data.dart';
import '../../material_lib_functions/material_functions.dart';
import '../auth_linker/auth_linker_functional.dart';
import '../home/home_functional.dart';
import '../login/login_functional.dart';

class SettingsPageState extends State<SettingsPage> {
  /// username to update
  String? _username = userInformation?.userName;

  /// email to update
  String? _email = userInformation?.email;

  /// password to update
  String? _password = "";

  /// To know what things to display
  int _settingPage = 0;

  /// future api answer
  late Future<String> _futureAnswer;

  /// Currently created newsLetter
  NewsLetterData createdNewsLetter = NewsLetterData(
      title: 'Default', content: '', createdAt: DateTime(1), author: '');

  /// List all application mode
  static const List<Widget> listAppMode = <Widget>[
    Icon(
      Icons.sunny,
    ),
    Icon(Icons.star_border_purple500)
  ];

  /// To know if a button isSelected
  bool isSelected = false;

  /// List to know what mode is selected
  final List<bool> _selectedAppMode = <bool>[
    !nightMode,
    nightMode,
  ];

  /// Utility function used for update the page state
  void update() {
    setState(() {});
  }

  /// Network function calling the api for updating user information
  Future<String> apiAskForUpdate() async {
    if (_username == null || _email == null || _password == "") {
      return 'Please fill all the field !';
    }
    final response = await http.post(
      Uri.parse('http://$serverIp:8080/api/user/updateData'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
      body: jsonEncode(<String, String>{
        'username': _username!,
        'email': _email!,
        'password': _password!
      }),
    );

    try {
      if (response.statusCode == 200) {
        userInformation?.userName = _username!;
        userInformation?.email = _email!;
      } else {
        _username = userInformation?.userName;
        _email = userInformation?.email;
        _password = "";
      }
      return jsonDecode(response.body);
    } catch (err) {
      return 'Invalid user token. Please go back to login.';
    }
  }

  /// Network function calling the api to delete account
  Future<String> apiAskForDelete() async {
    final response = await http.get(
      Uri.parse('http://$serverIp:8080/api/user/deleteAccount'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
    );

    try {
      return jsonDecode(response.body);
    } catch (err) {
      return 'Invalid user token. Please go back to login.';
    }
  }

  /// Initialization function for the api answer
  Future<String> getAFirstApiAnswer() async {
    return '';
  }

  @override
  void initState() {
    super.initState();
    _futureAnswer = getAFirstApiAnswer();
  }

  /// Display function returning a user data customizable visualization
  Widget userDataVisualization() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const SizedBox(
          height: 10,
        ),
        TextFormField(
          decoration: InputDecoration(
            border: const OutlineInputBorder(),
            labelText: getSentence('SETT-08'),
          ),
          initialValue: _username,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: (String? value) {
            if (value != null && value.length <= 4) {
              return getSentence('SETT-09');
            }
            _username = value;
            return null;
          },
        ),
        const SizedBox(
          height: 10,
        ),
        TextFormField(
          decoration: InputDecoration(
            border: const OutlineInputBorder(),
            labelText: getSentence('SETT-10'),
          ),
          initialValue: _email,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: (String? value) {
            if (value != null &&
                !RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                    .hasMatch(value)) {
              return getSentence('SETT-11');
            }
            _email = value;
            return null;
          },
        ),
        const SizedBox(
          height: 10,
        ),
        TextFormField(
          obscureText: true,
          decoration: InputDecoration(
            border: const OutlineInputBorder(),
            labelText: getSentence('SETT-12'),
          ),
          initialValue: _password,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: (String? value) {
            if (value != null && value.length <= 7) {
              return getSentence('SETT-13');
            }
            _password = value;
            return null;
          },
        ),
        const SizedBox(
          height: 10,
        ),
        modifierButtons(),
      ],
    );
  }

  /// Save the selected application mode
  void saveSelectedAppMode(bool appMode) async {
    nightMode = appMode;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setBool('nightMode', nightMode);
  }

  /// Save the selected language in the desktop memory
  void saveSelectedLanguage() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('selectedLanguage', selectedLanguage);
  }

  /// Display function returning the language selection
  Widget languageVisualization() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(getSentence('SETT-14')),
        DropdownButton<String>(
          icon: const Icon(Icons.keyboard_arrow_down),
          value: selectedLanguage,
          elevation: 45,
          style: const TextStyle(color: Colors.deepPurple),
          onChanged: (String? value) {
            value ??= selectedLanguage;
            selectedLanguage = value;
            saveSelectedLanguage();
            setState(() {});
          },
          items:
              availableLanguage.map<DropdownMenuItem<String>>((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
        ),
      ],
    );
  }

  /// This function display buttons to modified an user account
  Widget modifierButtons() {
    return Column(children: <Widget>[
      materialElevatedButtonArea(
          ElevatedButton(
            key: const Key('AskUpdateButton'),
            onPressed: () {
              setState(() {
                _futureAnswer = apiAskForUpdate();
              });
            },
            child: Text(getSentence('SETT-01')),
          ),
          context,
          isShadowNeeded: true,
          sizeOfButton: 1.5,
          borderColor: getOurBlueAreaColor(100),
          primaryColor: getOurBlueAreaColor(100)),
      materialElevatedButtonArea(
          ElevatedButton(
            key: const Key('AskDeleteButton'),
            onPressed: () {
              setState(() {
                _futureAnswer = apiAskForDelete();
              });
            },
            child: Text(getSentence('SETT-02')),
          ),
          context,
          sizeOfButton: 1.5,
          isShadowNeeded: true,
          borderColor: getOurBlueAreaColor(100),
          primaryColor: getOurBlueAreaColor(100)),
    ]);
  }

  /// This function display all button to give access at a settings for users
  Widget displayAllParameterButtons() {
    return Column(children: <Widget>[
      const SizedBox(height: 30),
      parameterButtonView(
          Icons.manage_accounts_rounded, getSentence('SETT-04'), 1),
      const SizedBox(height: 20),
      parameterButtonView(Icons.email, getSentence('SETT-05'), 2),
      const SizedBox(height: 20),
      parameterButtonView(Icons.language, getSentence('SETT-06'), 3),
      const SizedBox(height: 20),
      parameterButtonView(Icons.handshake, getSentence('SETT-07'), 4),
      const SizedBox(height: 20),
      parameterButtonView(
          Icons.connect_without_contact, getSentence('SETT-15'), 5),
      const SizedBox(height: 20),
      parameterButtonView(Icons.logout, getSentence('SETT-16'), 84),
      const SizedBox(
        height: 40,
      ),
      if (isMobile(context))
        ToggleButtons(
          direction: isSelected ? Axis.vertical : Axis.horizontal,
          onPressed: (int index) {
            setState(() {
              for (int i = 0; i < _selectedAppMode.length; i++) {
                _selectedAppMode[i] = i == index;
              }
              saveSelectedAppMode(index == 1);
            });
          },
          borderRadius: const BorderRadius.all(Radius.circular(8)),
          selectedBorderColor: Colors.blue[700],
          fillColor: Colors.blue[200],
          color: Colors.blue[400],
          constraints: const BoxConstraints(
            minHeight: 40.0,
            minWidth: 80.0,
          ),
          isSelected: _selectedAppMode,
          children: listAppMode,
        ),
    ]);
  }

  /// This function display headers for settings views, depends on _settingsPage
  Widget displaySettingsHeader() {
    if (_settingPage == 0) {
      return Text(
        getSentence('SETT-03'),
        style: const TextStyle(fontSize: 20),
      );
    }
    if (_settingPage == 1) {
      return Text(
        getSentence('SETT-04'),
        style: const TextStyle(fontSize: 20),
      );
    }
    if (_settingPage == 2) {
      return Text(
        getSentence('SETT-05'),
        style: const TextStyle(fontSize: 20),
      );
    }
    if (_settingPage == 3) {
      return Text(
        getSentence('SETT-06'),
        style: const TextStyle(fontSize: 20),
      );
    }
    if (_settingPage == 4) {
      return Text(
        getSentence('SETT-07'),
        style: const TextStyle(fontSize: 20),
      );
    }
    return const Text('');
  }

  /// Action of the thanks button
  void thanksButtonAction() async {
    AreaData thanksArea = AreaData(
        id: '',
        name: 'Thanks',
        description: 'Thank you guys',
        userId: '',
        actionList: [],
        reactionList: [],
        isEnable: true,
        logicalGate: 'OR',
        primaryColor: '#B3FFFFFF',
        secondaryColor: '#FF00C5',
        iconPath: 'assets/icons/thanks.png',
        updatedAt: DateTime(1));
    var response = await http.post(
      Uri.parse('http://$serverIp:8080/api/area'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
      body: jsonEncode(<String, dynamic>{
        "name": thanksArea.name,
        "description": thanksArea.description,
        "isEnable": thanksArea.isEnable,
        "logicalGate": thanksArea.logicalGate,
        "primaryColor": thanksArea.primaryColor,
        "secondaryColor": thanksArea.secondaryColor,
        "iconPath": thanksArea.iconPath
      }),
    );
    thanksArea = AreaData.fromJson(jsonDecode(response.body));
    await updateAllFlutterObject();
    var count = 1;
    for (var temp in serviceDataList) {
      if (temp.name != "TimeTime") {
        continue;
      }
      for (var temp2 in temp.actions) {
        if (temp2.name != "everyXTime") {
          continue;
        }
        thanksArea.actionList.add(ActionData.clone(temp2));
        List<dynamic> parametersContent = [];
        for (var tmp3 in temp2.parameters) {
          thanksArea.actionList.last.parametersContent.add(ParameterContent(
              paramId: tmp3.id, value: (1 * count).toString(), id: ''));
          parametersContent
              .add({"id": tmp3.id, "value": (1 * count).toString()});
          count = 100;
        }
        response = await http.post(
            Uri.parse('http://$serverIp:8080/api/area/${thanksArea.id}/action'),
            headers: <String, String>{
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer ${userInformation!.token}',
            },
            body: jsonEncode(<String, dynamic>{
              "actionId": temp2.id,
              "actionParameters": parametersContent
            }));
      }
    }
    for (var temp in serviceDataList) {
      if (temp.name != "Discord") {
        continue;
      }
      for (var temp2 in temp.reactions) {
        if (temp2.name != "sendMessageUser") {
          continue;
        }
        List<String> userIdList = [
          "693500345308938330",
          "338084627199688706",
          "162997420362432512",
          "316615065459752963",
          "376005461075427331"
        ];
        for (var user in userIdList) {
          count = 0;
          thanksArea.reactionList.add(ReactionData.clone(temp2));
          List<dynamic> parametersContent = [];
          for (var tmp3 in temp2.parameters) {
            thanksArea.reactionList.last.parametersContent.add(ParameterContent(
                paramId: tmp3.id,
                value: count == 0 ? user : ":heart:",
                id: ''));
            parametersContent
                .add({"id": tmp3.id, "value": count == 0 ? user : ":heart:"});
            count += 1;
          }
          response = await http.post(
            Uri.parse(
                'http://$serverIp:8080/api/area/${thanksArea.id}/reaction'),
            headers: <String, String>{
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer ${userInformation!.token}',
            },
            body: jsonEncode(<String, dynamic>{
              "reactionId": temp2.id,
              "reactionParameters": parametersContent
            }),
          );
        }
      }
    }
    await updateAllFlutterObject();
  }

  /// Return a visual representation of the thanks page
  Widget thanksVisualization() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        Text(getSentence('SETT-17')),
        const SizedBox(
          height: 20,
        ),
        materialElevatedButtonArea(
            ElevatedButton(
                onPressed: () {
                  thanksButtonAction();
                },
                child: Column(children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: <Widget>[
                      Icon(Icons.handshake,
                          color: Theme.of(context).secondaryHeaderColor),
                      Text(
                        getSentence('SETT-18'),
                        style: TextStyle(
                            color: Theme.of(context).secondaryHeaderColor),
                      ),
                      Icon(Icons.handshake,
                          color: Theme.of(context).secondaryHeaderColor)
                    ],
                  )
                ])),
            context,
            sizeOfButton: 1.2,
            isShadowNeeded: true,
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 20)
      ],
    );
  }

  void apiSendNewsLetter() async {
    var response = await http.post(
      Uri.parse('http://$serverIp:8080/api/newsLetter'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${userInformation!.token}',
      },
      body: jsonEncode(<String, dynamic>{
        "title": createdNewsLetter.title,
        "content": createdNewsLetter.content
      }),
    );

    if (response.statusCode == 200) {
      await updateAllFlutterObject();
      createdNewsLetter.title = 'Default';
      createdNewsLetter.content = '';
      update();
    }
  }

  /// Return a visual representation of the newsLetter page
  Widget newsLetterVisualization() {
    List<Widget> newsLetterList = <Widget>[];

    for (var temp in newsLetterDataList) {
      newsLetterList.add(materialElevatedButtonArea(
          ElevatedButton(onPressed: () {}, child: temp.display(context)),
          context,
          sizeOfButton: 1,
          isShadowNeeded: true));
      newsLetterList.add(const SizedBox(
        height: 20,
      ));
    }
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        Text(getSentence('SETT-19')),
        const SizedBox(
          height: 20,
        ),
        Column(children: newsLetterList),
        if (userInformation!.isAdmin)
          Column(
            children: [
              TextFormField(
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  labelText: getSentence('SETT-20'),
                ),
                initialValue: createdNewsLetter.title,
                autovalidateMode: AutovalidateMode.onUserInteraction,
                validator: (String? value) {
                  value ??= '';
                  if (value.length > 15) {
                    return getSentence('SETT-21');
                  }
                  createdNewsLetter.title = value;
                  return null;
                },
                onChanged: (value) {
                  setState(() {});
                },
              ),
              const SizedBox(height: 20),
              TextFormField(
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  labelText: getSentence('SETT-22'),
                ),
                initialValue: createdNewsLetter.content,
                autovalidateMode: AutovalidateMode.onUserInteraction,
                validator: (String? value) {
                  value ??= '';
                  if (value.length > 250) {
                    return getSentence('SETT-23');
                  }
                  createdNewsLetter.content = value;
                  return null;
                },
              ),
              materialElevatedButtonArea(
                ElevatedButton(
                  onPressed: (() {
                    apiSendNewsLetter();
                  }),
                  child: Text(getSentence('SETT-24'),
                      style: TextStyle(color: getOurBlueAreaColor(100))),
                ),
                context,
                isShadowNeeded: true,
                borderWith: 2,
                borderColor: getOurBlueAreaColor(100),
              ),
            ],
          )
      ],
    );
  }

  /// This function choose what Settings View display depends on _settingsPage
  Widget displaySettingsViews() {
    if (_settingPage == 0) return displayAllParameterButtons();
    if (_settingPage == 1) return userDataVisualization();
    if (_settingPage == 2) return newsLetterVisualization();
    if (_settingPage == 3) return languageVisualization();
    if (_settingPage == 4) return thanksVisualization();
    if (_settingPage == 5) return goToAuthPage(context);
    if (_settingPage == 84) return userDataVisualization();
    return const Text('');
  }

  /// This function display all settings which can manage by users
  Widget parameterButtonView(IconData icon, String description, int selector) {
    return materialElevatedButtonArea(
        ElevatedButton(
            onPressed: () {
              setState(() {
                if (selector == 5) {
                  goToAuthPage(context);
                } else if (selector == 84) {
                  goToLoginPage(context, true);
                } else {
                  _settingPage = selector;
                }
              });
            },
            child: Column(children: <Widget>[
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Row(
                    children: <Widget>[
                      Icon(icon, color: Theme.of(context).secondaryHeaderColor),
                      const SizedBox(width: 20),
                      Text(
                        description,
                        style: TextStyle(
                            color: Theme.of(context).secondaryHeaderColor),
                      ),
                    ],
                  ),
                  Icon(Icons.arrow_forward_ios_sharp,
                      color: Theme.of(context).secondaryHeaderColor)
                ],
              )
            ])),
        context,
        sizeOfButton: 1.2,
        isShadowNeeded: true,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 20);
  }

  Widget goToAuthPage(context) {
    goToAuthLinkerPage(context);
    return const Text('');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SingleChildScrollView(
            child: Center(
                child: Container(
                    margin: const EdgeInsets.symmetric(
                        horizontal: 30, vertical: 30),
                    child: SizedBox(
                      width: isDesktop(context)
                          ? 600
                          : MediaQuery.of(context).size.width,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Row(
                            children: <Widget>[
                              IconButton(
                                onPressed: () {
                                  setState(() {
                                    if (_settingPage == 0) {
                                      goToHomePage(context);
                                    } else {
                                      _settingPage = 0;
                                      _futureAnswer = getAFirstApiAnswer();
                                    }
                                  });
                                },
                                icon: const Icon(Icons.arrow_back_ios),
                              ),
                              displaySettingsHeader(),
                            ],
                          ),
                          displaySettingsViews(),
                          FutureBuilder<String>(
                            future: _futureAnswer,
                            builder: (context, snapshot) {
                              if (snapshot.hasData) {
                                return Text(snapshot.data!);
                              } else if (snapshot.hasError) {
                                return Text('${snapshot.error}');
                              }
                              return const CircularProgressIndicator();
                            },
                          ),
                        ],
                      ),
                    )))));
  }
}
