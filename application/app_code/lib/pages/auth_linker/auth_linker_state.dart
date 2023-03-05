import 'package:application/language/language.dart';
import 'package:application/pages/settings/settings_functional.dart';
import 'package:flutter/material.dart';

import 'auth_linker_functional.dart';
import 'auth_linker_page.dart';
import '../../material_lib_functions/material_functions.dart';

class AuthLinkerPageState extends State<AuthLinkerPage> {
  late Future<String> _futureApiResponse;

  /// Display all the Auth Box
  Widget displayAuthBox() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const SizedBox(
          height: 30,
        ),
        googleAuthBox.display(context),
        const SizedBox(
          height: 30,
        ),
        discordAuthBox.display(context),
        const SizedBox(
          height: 30,
        ),
        discordInviteAuthBox.display(context),
        const SizedBox(
          height: 30,
        ),
        deezerAuthBox.display(context),
        const SizedBox(
          height: 30,
        ),
        redditAuthBox.display(context),
      ],
    );
  }

  /// Initialization function for the api answer
  Future<String> getAFirstApiAnswer() async {
    return '';
  }

  /// Update state function
  void update(Function? asking) {
    setState(() {
      if (asking != null) {
        _futureApiResponse = asking();
      }
    });
  }

  @override
  void initState() {
    super.initState();
    _futureApiResponse = getAFirstApiAnswer();
    updateAuthPage = update;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: true,
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
                            children: [
                              IconButton(
                                  onPressed: () {
                                    setState(() {
                                      goToSettingsPage(context);
                                    });
                                  },
                                  icon: const Icon(Icons.arrow_back_ios)),
                              Text(getSentence('AUTHLINK-01')),
                            ],
                          ),
                          displayAuthBox(),
                          FutureBuilder<String>(
                            future: _futureApiResponse,
                            builder: (context, snapshot) {
                              if (snapshot.hasData) {
                                return Column(children: [
                                  const SizedBox(
                                    height: 30,
                                  ),
                                  Text(snapshot.data!)
                                ]);
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
