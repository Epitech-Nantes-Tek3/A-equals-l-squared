import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final int _counter = 0;
  late Future<About> futureAbout;

  Future<About> fetchApi() async {
    final response = await http.get(Uri.parse('http://127.0.0.1:8080/about.json'));

    if (response.statusCode == 200) {
      return About.fromJson(jsonDecode(response.body));
    } else {
      return const About(
        client: "error",
        server: -1,
      );
    }
  }

  void _incrementCounter() {
    setState(() {
      futureAbout = fetchApi();
    });
  }

  @override
  void initState() {
    super.initState();
    futureAbout = fetchApi();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            FutureBuilder<About>(
              future: futureAbout,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return Text("${snapshot.data!.client} : ${snapshot.data!.server}");
                } else if (snapshot.hasError) {
                  return Text('${snapshot.error}');
                }
                return const CircularProgressIndicator();
              },
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}

class About {
  final String client;
  final int server;

  const About({
    required this.client,
    required this.server,
  });

  factory About.fromJson(Map<String, dynamic> json) {
    return About(
      client: json['client']['host'],
      server: json['server']['current_time'],
    );
  }
}