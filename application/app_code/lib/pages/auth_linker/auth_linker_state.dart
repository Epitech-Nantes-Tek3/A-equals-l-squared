import 'package:application/pages/settings/settings_functional.dart';
import 'package:flutter/material.dart';

import 'auth_linker_functional.dart';
import 'auth_linker_page.dart';

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
        googleAuthBox.display(),
        const SizedBox(
          height: 30,
        ),
        discordAuthBox.display()
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
            child: Container(
                margin:
                    const EdgeInsets.symmetric(horizontal: 30, vertical: 30),
                child: Align(
                  alignment: Alignment.topCenter,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      const Text('Welcome to Auth Linker page'),
                      displayAuthBox(),
                      FutureBuilder<String>(
                        future: _futureApiResponse,
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            return Text(snapshot.data!);
                          } else if (snapshot.hasError) {
                            return Text('${snapshot.error}');
                          }
                          return const CircularProgressIndicator();
                        },
                      ),
                      ElevatedButton(
                        key: const Key('AuthLinkerHomeButton'),
                        onPressed: () {
                          setState(() {
                            goToSettingsPage(context);
                          });
                        },
                        child: const Text('Go settings'),
                      ),
                    ],
                  ),
                ))));
  }
}
