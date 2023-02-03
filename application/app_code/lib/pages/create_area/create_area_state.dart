import 'dart:convert';

import 'package:application/flutter_objects/area_data.dart';
import 'package:application/flutter_objects/parameter_data.dart';
import 'package:application/pages/create_area/create_area_functional.dart';
import 'package:application/pages/create_area/create_area_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../flutter_objects/service_data.dart';
import '../../network/informations.dart';
import '../home/home_functional.dart';

class CreateAreaPageState extends State<CreateAreaPage> {
  int _state = 0;

  String _name = "";

  late Future<String> _futureAnswer;

  List<ParameterContent> actionParameterContent = <ParameterContent>[];

  List<ParameterContent> reactionParameterContent = <ParameterContent>[];

  Future<String> apiAskForAreaCreation() async {
    try {
      List<Map<String, String>> actionParameter = <Map<String, String>>[];
      List<Map<String, String>> reactionParameter = <Map<String, String>>[];

      for (var temp in createdArea!.actionParameters) {
        actionParameter.add(
            <String, String>{'paramId': temp.paramId, 'value': temp.value});
      }

      for (var temp in createdArea!.reactionParameters) {
        reactionParameter.add(
            <String, String>{'paramId': temp.paramId, 'value': temp.value});
      }

      var response =
          await http.post(Uri.parse('http://$serverIp:8080/api/area/create'),
              headers: <String, String>{
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ${userInformation!.token}',
              },
              body: jsonEncode(<String, dynamic>{
                'actionId': createdArea!.actionId,
                'name': createdArea!.name,
                'actionParameters': actionParameter,
                'reactionId': createdArea!.reactionId,
                'reactionParameters': reactionParameter
              }));

      if (response.statusCode == 200) {
        return 'Success ! You can go back to home page';
      } else {
        return 'Error during creation.';
      }
    } catch (err) {
      debugPrint(err.toString());
      return 'Error during creation.';
    }
  }

  List<Widget> creationDisplay() {
    List<Widget> createVis = <Widget>[];

    if (createdAreaContent.length == 1 && _state == 0) {
      _state = 1;
    }

    if (_state == 6) {
      createVis.add(const Text("AREA overview"));
      createVis.add(
        TextFormField(
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Area Name',
          ),
          initialValue: _name,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          validator: (String? value) {
            _name = value!;
            createdArea = AreaData(
                id: "",
                name: _name,
                userId: "",
                actionId: createdAreaContent[0].actions[0].id,
                reactionId: createdAreaContent[1].reactions[0].id,
                isEnable: true,
                actionParameters:
                    createdAreaContent[0].actions[0].getAllParameterContent(),
                reactionParameters: createdAreaContent[1]
                    .reactions[0]
                    .getAllParameterContent());
            return null;
          },
        ),
      );
      if (_name == "") {
        createdArea = AreaData(
            id: "",
            name: _name,
            userId: "",
            actionId: createdAreaContent[0].actions[0].id,
            reactionId: createdAreaContent[1].reactions[0].id,
            isEnable: true,
            actionParameters:
                createdAreaContent[0].actions[0].getAllParameterContent(),
            reactionParameters:
                createdAreaContent[1].reactions[0].getAllParameterContent());
      }
      createVis.add(createdArea!.display(true));
      createVis.add(ElevatedButton(
          onPressed: () {
            setState(() {
              _futureAnswer = apiAskForAreaCreation();
            });
          },
          child: const Text("Create AREA")));
      createVis.add(
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
      );
    }

    if (_state == 5) {
      createVis.add(const Text("Configure your Reaction"));
      createVis.add(createdAreaContent[1]
          .reactions[0]
          .display(true, reactionParameterContent));
      createVis.add(ElevatedButton(
          onPressed: () {
            setState(() {
              _state = 6;
            });
          },
          child: const Text("Validate")));
    }

    if (_state == 4) {
      createVis.add(const Text("Choose your Reaction"));
      for (var temp in createdAreaContent[1].reactions) {
        createVis.add(ElevatedButton(
            onPressed: () {
              setState(() {
                for (var tmp in temp.parameters) {
                  actionParameterContent
                      .add(ParameterContent(paramId: tmp.id, value: ""));
                }
                createdAreaContent[1].reactions = [temp];
                _state = 5;
              });
            },
            child: temp.display(false, [])));
      }
    }

    if (_state == 3) {
      createVis.add(const Text("Choose your Reaction service"));
      for (var temp in serviceDataList) {
        createVis.add(ElevatedButton(
            onPressed: () {
              setState(() {
                createdAreaContent.add(temp);
                _state = 4;
              });
            },
            child: temp.display()));
      }
    }

    if (_state == 2) {
      createVis.add(const Text("Configure your Action"));
      createVis.add(createdAreaContent[0]
          .actions[0]
          .display(true, actionParameterContent));
      createVis.add(ElevatedButton(
          onPressed: () {
            setState(() {
              _state = 3;
            });
          },
          child: const Text("Validate")));
    }

    if (_state == 1) {
      createVis.add(const Text("Choose your Action"));
      for (var temp in createdAreaContent[0].actions) {
        createVis.add(ElevatedButton(
            onPressed: () {
              setState(() {
                for (var tmp in temp.parameters) {
                  actionParameterContent
                      .add(ParameterContent(paramId: tmp.id, value: ""));
                }
                createdAreaContent[0].actions = [temp];
                _state = 2;
              });
            },
            child: temp.display(false, [])));
      }
    }

    if (_state == 0) {
      createVis.add(const Text("Choose your Action service"));
      for (var temp in serviceDataList) {
        createVis.add(ElevatedButton(
            onPressed: () {
              setState(() {
                createdAreaContent = <ServiceData>[];
                createdAreaContent.add(temp);
                _state = 1;
              });
            },
            child: temp.display()));
      }
    }

    return createVis;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          const Text('Welcome to Create Area page'),
          Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: creationDisplay(),
          ),
          ElevatedButton(
            key: const Key('CreateAreaHomeButton'),
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
