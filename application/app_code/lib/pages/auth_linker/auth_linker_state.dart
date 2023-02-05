import 'package:flutter/material.dart';

import '../home/home_functional.dart';
import 'auth_linker_functional.dart';
import 'auth_linker_page.dart';

class AuthLinkerPageState extends State<AuthLinkerPage> {
  late Future<String> _futureApiResponse;

  /// Display all the Auth Box
  Widget displayAuthBox() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [googleAuthBox.display(), discordAuthBox.display()],
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
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
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
                goToHomePage(context);
              });
            },
            child: const Text('Go Home'),
          ),
        ],
      ),
    ));
  }
}
