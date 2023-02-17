import 'dart:convert';

import 'package:application/flutter_objects/parameter_data.dart';
import 'package:application/pages/create_area/create_area_functional.dart';
import 'package:application/pages/create_area/create_area_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../flutter_objects/action_data.dart';
import '../../flutter_objects/reaction_data.dart';
import '../../flutter_objects/service_data.dart';
import '../../network/informations.dart';
import '../home/home_functional.dart';

class CreateAreaPageState extends State<CreateAreaPage> {
  /// Creation of an Action state
  int _actionCreationState = 0;

  /// Creation of an Reaction state
  int _reactionCreationState = 0;

  /// Name of the AREA
  String _name = "";

  /// Variable to know if an User want to choose an Action
  bool _isChoosingAnAction = false;

  /// Variable to know if an User want to choose a Reaction
  bool _isChoosingAReaction = false;

  /// Status of the AREA
  bool _isEnable = true;

  /// Save of the creation state
  List<ServiceData> _createdAreaContentSave = <ServiceData>[];

  /// Save of the creation of an Action state
  List<ServiceData> _createdActionContentSave = <ServiceData>[];

  /// Save of the creation of an Reaction state
  List<ServiceData> _createdReactionContentSave = <ServiceData>[];

  /// Future answer of the api
  late Future<String> _futureAnswer;

  /// Parameter value of the action
  List<ParameterContent> actionParameterContent = <ParameterContent>[];

  /// Parameter value of the reaction
  List<ParameterContent> reactionParameterContent = <ParameterContent>[];

  /// Useful function updating the state
  /// object -> Object who's calling the function
  void createUpdate(ParameterData object) async {
    await object.getProposalValue();
    setState(() {});
  }

  /// Ask the api to create an area
  Future<String> apiAskForAreaCreation() async {
    try {
      List<Map<String, String>> actionParameter = <Map<String, String>>[];
      List<Map<String, String>> reactionParameter = <Map<String, String>>[];

      for (var temp in createdArea!.actionParameters) {
        String value = temp.value;
        ParameterData? associated = temp.getParameterData();
        if (associated != null && associated.getterValue != null) {
          value = associated.getterValue![temp.value]!;
        }
        actionParameter
            .add(<String, String>{'paramId': temp.paramId, 'value': value});
      }

      for (var temp in createdArea!.reactionParameters) {
        String value = temp.value;
        ParameterData? associated = temp.getParameterData();
        if (associated != null && associated.getterValue != null) {
          value = associated.getterValue![temp.value]!;
        }
        reactionParameter
            .add(<String, String>{'paramId': temp.paramId, 'value': value});
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
                'reactionParameters': reactionParameter,
                'isEnable': _isEnable
              }));

      if (response.statusCode == 200) {
        await updateAllFlutterObject();
        return 'Success ! You can go back to home page';
      } else {
        return response.body.toString();
      }
    } catch (err) {
      debugPrint(err.toString());
      return 'Error during creation.';
    }
  }

  /// Initialization function for the api answer
  Future<String> getAFirstApiAnswer() async {
    return '';
  }

  List<Widget> chooseAnAction() {
    List<Widget> createAnAction = <Widget>[];

    if (_isChoosingAnAction == true && _actionCreationState == 0) {
      createAnAction.add(const Text("Choose your Action service"));
      for (var temp in serviceDataList) {
        createAnAction.add(
          const SizedBox(
            height: 10,
          ),
        );
        createAnAction.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),
              // Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdActionContentSave = createdAreaContent
                    .map((v) => ServiceData.clone(v))
                    .toList();
                createdAreaContent.add(ServiceData.clone(temp));
                _reactionCreationState = 1;
              });
            },
            child: temp.display()));
        createAnAction.add(
          const SizedBox(
            height: 10,
          ),
        );
      }
    }
    if (_actionCreationState == 1) {
      createAnAction.add(Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const <Widget>[Text("Choose your Action")]));
      createAnAction.add(
        const SizedBox(
          height: 30,
        ),
      );
      for (var temp in createdAreaContent[0].actions) {
        createAnAction.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),

              /// Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdActionContentSave = createdAreaContent
                    .map((v) => ServiceData.clone(v))
                    .toList();
                if (actionParameterContent.isNotEmpty) {
                  actionParameterContent = <ParameterContent>[];
                }
                for (var tmp in temp.parameters) {
                  actionParameterContent
                      .add(ParameterContent(paramId: tmp.id, value: ""));
                }
                createdAreaContent[0].actions = [ActionData.clone(temp)];
                _actionCreationState = 2;
              });
            },
            child: temp.display(false, [], createUpdate)));
        createAnAction.add(
          const SizedBox(
            height: 10,
          ),
        );
      }
    }

    if (_actionCreationState == 2) {
      createAnAction.add(const Text("Configure your Action"));
      createAnAction.add(
        const SizedBox(
          height: 10,
        ),
      );
      createAnAction.add(createdAreaContent[0]
          .actions[0]
          .display(true, actionParameterContent, createUpdate));
      createAnAction.add(
        const SizedBox(
          height: 10,
        ),
      );
      createAnAction.add(ElevatedButton(
          onPressed: () {
            setState(() {
              bool isRequired = true;
              _createdActionContentSave =
                  createdAreaContent.map((v) => ServiceData.clone(v)).toList();
              for (var temp in createdAreaContent[0].actions[0].parameters) {
                if (temp.isRequired && temp.matchedContent!.value == "") {
                  isRequired = false;
                }
              }
              if (isRequired) {
                _actionCreationState = 0;

                /// Add this Action in DB
                _isChoosingAnAction = false;
              }
            });
          },
          child: const Text("Validate")));
    }

    if (_isChoosingAnAction) {
      createAnAction
          .add(Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
        ElevatedButton(
          key: const Key('CreateActionPreviousButton'),
          onPressed: () {
            setState(() {
              createdAreaContent = _createdActionContentSave
                  .map((v) => ServiceData.clone(v))
                  .toList();
              if (_actionCreationState == 0) {
                _isChoosingAnAction = false;
                _actionCreationState = 0;
                createdArea = null;
                _createdActionContentSave = <ServiceData>[];
                createdAreaContent = <ServiceData>[];
              }
              _actionCreationState -= 1;
            });
          },
          child: const Text('Previous'),
        ),
      ]));
    }

    return createAnAction;
  }

  chooseAReaction() {
    List<Widget> createAReaction = <Widget>[];

    if (_isChoosingAReaction == true && _reactionCreationState == 0) {
      createAReaction.add(const Text("Choose your Reaction service"));
      for (var temp in serviceDataList) {
        createAReaction.add(
          const SizedBox(
            height: 10,
          ),
        );
        createAReaction.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),
              // Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdReactionContentSave = createdAreaContent
                    .map((v) => ServiceData.clone(v))
                    .toList();
                createdAreaContent.add(ServiceData.clone(temp));
                _reactionCreationState = 1;
              });
            },
            child: temp.display()));
        createAReaction.add(
          const SizedBox(
            height: 10,
          ),
        );
      }
    }
    if (_reactionCreationState == 1) {
      createAReaction.add(const Text("Choose your Reaction"));
      for (var temp in createdAreaContent[1].reactions) {
        createAReaction.add(
          const SizedBox(
            height: 10,
          ),
        );
        createAReaction.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),
              // Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdReactionContentSave = createdAreaContent
                    .map((v) => ServiceData.clone(v))
                    .toList();
                if (reactionParameterContent.isNotEmpty) {
                  reactionParameterContent = <ParameterContent>[];
                }
                for (var tmp in temp.parameters) {
                  reactionParameterContent
                      .add(ParameterContent(paramId: tmp.id, value: ""));
                }
                createdAreaContent[1].reactions = [ReactionData.clone(temp)];
                _reactionCreationState = 2;
              });
            },
            child: temp.display(false, [], createUpdate)));
        createAReaction.add(
          const SizedBox(
            height: 10,
          ),
        );
      }
    }

    if (_reactionCreationState == 2) {
      createAReaction.add(const Text("Configure your Reaction"));
      createAReaction.add(
        const SizedBox(
          height: 10,
        ),
      );
      createAReaction.add(createdAreaContent[1]
          .reactions[0]
          .display(true, reactionParameterContent, createUpdate));
      createAReaction.add(
        const SizedBox(
          height: 10,
        ),
      );
      createAReaction.add(ElevatedButton(
          onPressed: () {
            setState(() {
              bool isRequired = true;
              _createdReactionContentSave =
                  createdAreaContent.map((v) => ServiceData.clone(v)).toList();
              for (var temp in createdAreaContent[1].reactions[0].parameters) {
                if (temp.isRequired && temp.matchedContent!.value == "") {
                  isRequired = false;
                }
              }
              if (isRequired) {
                _reactionCreationState = 0;

                /// Add this Reaction in DB
              }
            });
          },
          child: const Text("Validate")));
    }

    if (_isChoosingAReaction) {
      createAReaction
          .add(Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
        ElevatedButton(
          key: const Key('CreateActionPreviousButton'),
          onPressed: () {
            setState(() {
              createdAreaContent = _createdReactionContentSave
                  .map((v) => ServiceData.clone(v))
                  .toList();
              if (_reactionCreationState == 0) {
                _isChoosingAReaction = false;
                _reactionCreationState = 0;
                createdArea = null;
                _createdReactionContentSave = <ServiceData>[];
                createdAreaContent = <ServiceData>[];
              }
              _reactionCreationState -= 1;
            });
          },
          child: const Text('Previous'),
        ),
      ]));
    }

    return createAReaction;
  }

  Widget displayActionViewToCreateAnArea() {
    return Column(children: <Widget>[
      if (!_isChoosingAnAction)
        ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
              // Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _isChoosingAnAction = true;
                _actionCreationState = 0;
              });
            },
            child: const Text(
              'Add an Action',
              style: TextStyle(color: Colors.black),
            )),
      if (_isChoosingAnAction)
        Column(
          children: <Widget>[
            const Text('Display all services'),
            Column(children: chooseAnAction()),
          ],
        )
    ]);
  }

  Widget displayReactionViewToCreateAnArea() {
    return Column(children: <Widget>[
      if (!_isChoosingAReaction)
        ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
              // Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _isChoosingAReaction = true;
                _reactionCreationState = 0;
              });
            },
            child: const Text(
              'Add a Reaction',
              style: TextStyle(color: Colors.black),
            )),
      if (_isChoosingAReaction)
        Column(
          children: <Widget>[
            const Text('Display all services'),
            Column(children: chooseAReaction()),
          ],
        )
    ]);
  }

  @override
  void initState() {
    super.initState();
    _futureAnswer = getAFirstApiAnswer();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SingleChildScrollView(
            child: Container(
      margin: const EdgeInsets.symmetric(horizontal: 30, vertical: 30),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              IconButton(
                  onPressed: () {
                    setState(() {
                      createdArea = null;
                      _createdAreaContentSave = <ServiceData>[];
                      _createdActionContentSave = <ServiceData>[];
                      _createdReactionContentSave = <ServiceData>[];
                      createdAreaContent = <ServiceData>[];
                      goToHomePage(context);
                    });
                  },
                  icon: const Icon(Icons.home_filled)),
              const Text(
                'Create a new Area',
                style: TextStyle(fontFamily: 'Roboto-Bold', fontSize: 20),
              )
            ],
          ),
          const SizedBox(
            height: 30,
          ),

          /// Block Action
          const Text(
            'Action',
            style: TextStyle(fontSize: 20),
          ),
          const SizedBox(
            height: 20,
          ),

          /// if (_hasAnAction)
          /// display all Actions chosen by the User
          displayActionViewToCreateAnArea(),

          const SizedBox(
            height: 30,
          ),

          /// Block Reaction
          const Text(
            'Reaction',
            style: TextStyle(fontSize: 20),
          ),
          const SizedBox(
            height: 20,
          ),

          /// if (_hasAReaction)
          /// display all Reactions chosen by the User
          displayReactionViewToCreateAnArea(),
        ],
      ),
    )));
  }
}
