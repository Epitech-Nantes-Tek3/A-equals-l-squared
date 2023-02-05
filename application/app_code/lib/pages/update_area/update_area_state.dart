import 'dart:convert';

import 'package:application/pages/update_area/update_area_functional.dart';
import 'package:application/pages/update_area/update_area_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../network/informations.dart';
import '../home/home_functional.dart';

class UpdateAreaPageState extends State<UpdateAreaPage> {
  /// Future answer of the api
  late Future<String> _futureAnswer;

  /// Initialization function for the api answer
  Future<String> getAFirstApiAnswer() async {
    return '';
  }

  @override
  void initState() {
    super.initState();
    _futureAnswer = getAFirstApiAnswer();
  }

  /// Ask the api to delete an AREA
  Future<String> apiAskForDeleteArea() async {
    try {
      var response =
          await http.post(Uri.parse('http://$serverIp:8080/api/delete/area'),
              headers: <String, String>{
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ${userInformation!.token}',
              },
              body: jsonEncode(<String, dynamic>{
                'id': updatingArea!.id,
              }));

      if (response.statusCode == 200) {
        updatingArea = null;
        await updateAllFlutterObject();
        return 'API successfully deleted. You can go back to home';
      } else {
        return response.body.toString();
      }
    } catch (err) {
      debugPrint(err.toString());
      return 'Error during creation.';
    }
  }

  /// Ask the api to update an AREA
  Future<String> apiAskForUpdateArea() async {
    try {
      List<Map<String, String>> actionParameter = <Map<String, String>>[];
      List<Map<String, String>> reactionParameter = <Map<String, String>>[];

      for (var temp in updatingArea!.actionParameters) {
        actionParameter.add(
            <String, String>{'paramId': temp.paramId, 'value': temp.value});
      }

      for (var temp in updatingArea!.reactionParameters) {
        reactionParameter.add(
            <String, String>{'paramId': temp.paramId, 'value': temp.value});
      }

      var response =
          await http.post(Uri.parse('http://$serverIp:8080/api/update/area'),
              headers: <String, String>{
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ${userInformation!.token}',
              },
              body: jsonEncode(<String, dynamic>{
                'id': updatingArea!.id,
                'actionId': updatingArea!.actionId,
                'name': updatingArea!.name,
                'actionParameters': actionParameter,
                'reactionId': updatingArea!.reactionId,
                'reactionParameters': reactionParameter,
                'isEnable': updatingArea!.isEnable
              }));

      if (response.statusCode == 200) {
        await updateAllFlutterObject();
        return 'AREA successfully updated ! You can go back to home';
      } else {
        return response.body.toString();
      }
    } catch (err) {
      debugPrint(err.toString());
      return 'Error during update process.';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SingleChildScrollView(
            child: Container(
      margin: const EdgeInsets.symmetric(horizontal: 30, vertical: 30),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          Row(
            children: <Widget>[
              IconButton(
                  onPressed: () {
                    setState(() {
                      goToHomePage(context);
                    });
                  },
                  icon: const Icon(Icons.home_filled)),
              const Text('Area settings', style: TextStyle(fontSize: 25),),
            ],
          ),
          if (updatingArea != null) updatingArea!.display(true),
          if (updatingArea != null)
            Switch(
              value: updatingArea!.isEnable,
              activeColor: Colors.blue,
              onChanged: (bool value) {
                setState(() {
                  updatingArea!.isEnable = value;
                });
              },
            ),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                key: const Key('UpdateAreaDeleteButton'),
                onPressed: () {
                  setState(() {
                    _futureAnswer = apiAskForDeleteArea();
                  });
                },
                child: Text(updatingArea != null
                    ? 'Delete ${updatingArea!.name}'
                    : 'Already deleted.'),
              ),
              if (updatingArea != null)
                ElevatedButton(
                  key: const Key('UpdateAreaValidateButton'),
                  onPressed: () {
                    setState(() {
                      _futureAnswer = apiAskForUpdateArea();
                    });
                  },
                  child: const Text('Send modification'),
                ),
            ],
          ),
        ],
      ),
    )));
  }
}
