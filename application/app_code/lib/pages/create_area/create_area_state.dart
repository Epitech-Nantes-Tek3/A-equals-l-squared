import 'dart:convert';

import 'package:application/flutter_objects/parameter_data.dart';
import 'package:application/pages/create_area/create_area_functional.dart';
import 'package:application/pages/create_area/create_area_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../flutter_objects/action_data.dart';
import '../../flutter_objects/area_data.dart';
import '../../flutter_objects/reaction_data.dart';
import '../../flutter_objects/service_data.dart';
import '../../network/informations.dart';
import '../home/home_functional.dart';

class CreateAreaPageState extends State<CreateAreaPage> {
  /// Setting of the action set ?
  bool actionSetting = false;

  /// Creation of an Action state
  int _actionCreationState = 0;

  /// Creation of an Reaction state
  int _reactionCreationState = 0;

  /// Variable to know if an User want to choose an Action
  bool _isChoosingAnAction = false;

  /// Variable to know if an User want to choose a Reaction
  bool _isChoosingAReaction = false;

  /// Save of the creation state
  AreaData? _createdAreaSave;

  /// Useful function updating the state
  /// object -> Object who's calling the function
  void createUpdate(ParameterData? object) async {
    if (object != null) {
      await object.getProposalValue();
    }
    setState(() {});
  }

  /// Ask the api to change an area
  Future<String> apiAskForAreaChange() async {
    try {
      late http.Response response;
      if (changeType == 'create') {
        response = await http.post(
          Uri.parse('http://$serverIp:8080/api/area'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ${userInformation!.token}',
          },
          body: jsonEncode(<String, dynamic>{
            "name": createdArea!.name,
            "description": createdArea!.description,
            "isEnable": createdArea!.isEnable,
            "logicalGate": createdArea!.logicalGate
          }),
        );
      } else if (changeType == 'update') {
        response = await http.put(
          Uri.parse('http://$serverIp:8080/api/area/${createdArea!.id}'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ${userInformation!.token}',
          },
          body: jsonEncode(<String, dynamic>{
            "name": createdArea!.name,
            "description": createdArea!.description,
            "isEnable": createdArea!.isEnable,
            "logicalGate": createdArea!.logicalGate
          }),
        );
      } else if (changeType == 'delete') {
        response = await http.delete(
          Uri.parse('http://$serverIp:8080/api/area/${createdArea!.id}'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ${userInformation!.token}',
          },
        );
      } else {
        return 'Error during $changeType process';
      }

      if (response.statusCode != 200) {
        return 'Error during area $changeType';
      }
      if (changeType == 'create') {
        createdArea = AreaData.fromJson(jsonDecode(response.body));
      }
      await updateAllFlutterObject();
      return 'Area successfully $changeType !';
    } catch (err) {
      return 'Error during area $changeType';
    }
  }

  /// Ask the api to change an action
  Future<String> apiAskForActionChange(ActionData action) async {
    try {
      late http.Response response;
      List<dynamic> parametersContent = [];

      for (var temp in action.parametersContent) {
        ParameterData paramData = temp.getParameterData()!;
        parametersContent.add({
          "id": changeType == 'create' ? temp.paramId : temp.id,
          "value": paramData.getterUrl == null
              ? temp.value
              : paramData.getterValue != null
                  ? paramData.getterValue![temp.value]
                  : ''
        });
      }

      if (changeType == 'create') {
        response = await http.post(
          Uri.parse('http://$serverIp:8080/api/area/${createdArea!.id}/action'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ${userInformation!.token}',
          },
          body: jsonEncode(<String, dynamic>{
            "actionId": action.id,
            "actionParameters": parametersContent
          }),
        );
      } else if (changeType == 'update') {
        response = await http.put(
          Uri.parse(
              'http://$serverIp:8080/api/area/${createdArea!.id}/action/${action.id}'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ${userInformation!.token}',
          },
          body: jsonEncode(
              <String, dynamic>{"actionParameters": parametersContent}),
        );
      } else if (changeType == 'delete') {
        response = await http.delete(
          Uri.parse(
              'http://$serverIp:8080/api/area/${createdArea!.id}/action/${action.id}'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ${userInformation!.token}',
          },
        );
      } else {
        return 'Error during $changeType process';
      }
      if (response.statusCode != 200) {
        return 'Error during action $changeType';
      }
      if (changeType == 'create') {
        response = await http.get(
            Uri.parse('http://$serverIp:8080/api/area/${createdArea!.id}'),
            headers: <String, String>{
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer ${userInformation!.token}',
            });
        createdArea = AreaData.fromJson(jsonDecode(response.body));
        createUpdate(null);
      }
      await updateAllFlutterObject();
      return 'Action successfully $changeType !';
    } catch (err) {
      return 'Error during area $changeType';
    }
  }

  /// Ask the api to change a reaction
  Future<String> apiAskForReactionChange(ReactionData reaction) async {
    try {
      late http.Response response;
      List<dynamic> parametersContent = [];

      for (var temp in reaction.parametersContent) {
        ParameterData paramData = temp.getParameterData()!;
        parametersContent.add({
          "id": changeType == 'create' ? temp.paramId : temp.id,
          "value": paramData.getterUrl == null
              ? temp.value
              : paramData.getterValue != null
                  ? paramData.getterValue![temp.value]
                  : ''
        });
      }

      if (changeType == 'create') {
        response = await http.post(
          Uri.parse(
              'http://$serverIp:8080/api/area/${createdArea!.id}/reaction'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ${userInformation!.token}',
          },
          body: jsonEncode(<String, dynamic>{
            "reactionId": reaction.id,
            "reactionParameters": parametersContent
          }),
        );
      } else if (changeType == 'update') {
        response = await http.put(
          Uri.parse(
              'http://$serverIp:8080/api/area/${createdArea!.id}/reaction/${reaction.id}'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ${userInformation!.token}',
          },
          body: jsonEncode(
              <String, dynamic>{"reactionParameters": parametersContent}),
        );
      } else if (changeType == 'delete') {
        response = await http.delete(
          Uri.parse(
              'http://$serverIp:8080/api/area/${createdArea!.id}/reaction/${reaction.id}'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ${userInformation!.token}',
          },
        );
      } else {
        return 'Error during $changeType process';
      }
      if (response.statusCode != 200) {
        return 'Error during reaction $changeType';
      }
      if (changeType == 'create') {
        response = await http.get(
            Uri.parse('http://$serverIp:8080/api/area/${createdArea!.id}'),
            headers: <String, String>{
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer ${userInformation!.token}',
            });
        createdArea = AreaData.fromJson(jsonDecode(response.body));
        createUpdate(null);
      }
      await updateAllFlutterObject();
      return 'Reaction successfully $changeType !';
    } catch (err) {
      return 'Error during area $changeType';
    }
  }

  List<Widget> chooseAnAction() {
    List<Widget> createAnAction = <Widget>[];

    if (_isChoosingAnAction == true && _actionCreationState == 0) {
      createAnAction.add(const Text("Choose your Action service"));
      for (var temp in serviceDataList) {
        if (temp.actions.isEmpty) {
          continue;
        }
        createAnAction.add(
          const SizedBox(
            height: 10,
          ),
        );
        createAnAction.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),

              /// Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdAreaSave = AreaData.clone(createdArea!);
                createdArea!.serviceId = ServiceData.clone(temp);
                _actionCreationState = 1;
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
      for (var temp in createdArea!.serviceId!.actions) {
        createAnAction.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),

              /// Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdAreaSave = AreaData.clone(createdArea!);
                createdArea!.actionList.add(ActionData.clone(temp));
                for (var tmp in temp.parameters) {
                  createdArea!.actionList.last.parametersContent.add(
                      ParameterContent(paramId: tmp.id, value: "", id: ''));
                }
                _actionCreationState = 2;
              });
            },
            child: temp.display(false, createUpdate)));
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
      createAnAction
          .add(createdArea!.actionList.last.display(true, createUpdate));
      createAnAction.add(
        const SizedBox(
          height: 10,
        ),
      );
      createAnAction.add(ElevatedButton(
          onPressed: () {
            setState(() {
              bool isRequired = true;
              _createdAreaSave = AreaData.clone(createdArea!);
              for (var temp in createdArea!.actionList.last.parameters) {
                if (temp.isRequired && temp.matchedContent!.value == "") {
                  isRequired = false;
                }
              }
              if (isRequired) {
                _actionCreationState = 0;

                changeType = 'create';
                apiAskForActionChange(createdArea!.actionList.last);
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
              createdArea = AreaData.clone(_createdAreaSave!);
              if (_actionCreationState == 0) {
                _isChoosingAnAction = false;
                _actionCreationState = 0;
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
        if (temp.reactions.isEmpty) {
          continue;
        }
        createAReaction.add(
          const SizedBox(
            height: 10,
          ),
        );
        createAReaction.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),

              /// Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdAreaSave = AreaData.clone(createdArea!);
                createdArea!.serviceId = ServiceData.clone(temp);
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
      createAReaction.add(Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const <Widget>[Text("Choose your Reaction")]));
      createAReaction.add(
        const SizedBox(
          height: 30,
        ),
      );
      for (var temp in createdArea!.serviceId!.reactions) {
        createAReaction.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),

              /// Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdAreaSave = AreaData.clone(createdArea!);
                createdArea!.reactionList.add(ReactionData.clone(temp));
                for (var tmp in temp.parameters) {
                  createdArea!.reactionList.last.parametersContent.add(
                      ParameterContent(paramId: tmp.id, value: "", id: ''));
                }
                _reactionCreationState = 2;
              });
            },
            child: temp.display(false, createUpdate)));
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
      createAReaction
          .add(createdArea!.reactionList.last.display(true, createUpdate));
      createAReaction.add(
        const SizedBox(
          height: 10,
        ),
      );
      createAReaction.add(ElevatedButton(
          onPressed: () {
            setState(() {
              bool isRequired = true;
              _createdAreaSave = AreaData.clone(createdArea!);
              for (var temp in createdArea!.reactionList.last.parameters) {
                if (temp.isRequired && temp.matchedContent!.value == "") {
                  isRequired = false;
                }
              }
              if (isRequired) {
                _reactionCreationState = 0;

                changeType = 'create';
                apiAskForReactionChange(createdArea!.reactionList.last);
                _isChoosingAReaction = false;
              }
            });
          },
          child: const Text("Validate")));
    }

    if (_isChoosingAReaction) {
      createAReaction
          .add(Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
        ElevatedButton(
          key: const Key('CreateReactionPreviousButton'),
          onPressed: () {
            setState(() {
              createdArea = AreaData.clone(_createdAreaSave!);
              if (_reactionCreationState == 0) {
                _isChoosingAReaction = false;
                _reactionCreationState = 0;
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

              /// Change when DB is Up
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

              /// Change when DB is Up
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
            Column(children: chooseAReaction()),
          ],
        )
    ]);
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> actionListDisplay = <Widget>[];
    List<Widget> reactionListDisplay = <Widget>[];

    if (createdArea != null && createdArea!.actionList.isNotEmpty) {
      for (var temp in createdArea!.actionList) {
        if (_actionCreationState != 2 || temp != createdArea!.actionList.last) {
          actionListDisplay.add(Column(children: [
            temp.display(true, createUpdate),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                    onPressed: () {
                      changeType = 'update';
                      apiAskForActionChange(temp);
                    },
                    child: const Text('Update')),
                ElevatedButton(
                    onPressed: () {
                      changeType = 'delete';
                      apiAskForActionChange(temp);
                      setState(() {
                        createdArea!.actionList.remove(temp);
                      });
                    },
                    child: const Text('Delete'))
              ],
            )
          ]));
        }
      }
    }

    if (createdArea != null && createdArea!.reactionList.isNotEmpty) {
      for (var temp in createdArea!.reactionList) {
        if (_reactionCreationState != 2 ||
            temp != createdArea!.reactionList.last) {
          reactionListDisplay.add(Column(children: [
            temp.display(true, createUpdate),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                    onPressed: () {
                      changeType = 'update';
                      apiAskForReactionChange(temp);
                    },
                    child: const Text('Update')),
                ElevatedButton(
                    onPressed: () {
                      changeType = 'delete';
                      apiAskForReactionChange(temp);
                      setState(() {
                        createdArea!.reactionList.remove(temp);
                      });
                    },
                    child: const Text('Delete'))
              ],
            )
          ]));
        }
      }
    }

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
                      _createdAreaSave = null;
                      actionSetting = false;
                      goToHomePage(context);
                    });
                  },
                  icon: const Icon(Icons.home_filled)),
              Text(
                createdArea != null ? createdArea!.name : '',
                style: const TextStyle(fontFamily: 'Roboto-Bold', fontSize: 20),
              )
            ],
          ),
          const SizedBox(
            height: 30,
          ),
          if (actionSetting)
            Column(children: [
              /// Block Action
              const Text(
                'Action',
                style: TextStyle(fontSize: 20),
              ),
              const SizedBox(
                height: 20,
              ),

              Column(children: actionListDisplay),
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

              Column(children: reactionListDisplay),
              displayReactionViewToCreateAnArea()
            ])
          else
            Column(children: [
              TextFormField(
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Area Name',
                ),
                initialValue: createdArea != null ? createdArea!.name : '',
                autovalidateMode: AutovalidateMode.onUserInteraction,
                validator: (String? value) {
                  createdArea!.name = value!;
                  return null;
                },
              ),
              TextFormField(
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Area Description',
                ),
                initialValue:
                    createdArea != null ? createdArea!.description : '',
                autovalidateMode: AutovalidateMode.onUserInteraction,
                validator: (String? value) {
                  createdArea!.description = value!;
                  return null;
                },
              ),
              Switch(
                value: createdArea != null ? createdArea!.isEnable : true,
                activeColor: Colors.blue,
                onChanged: (bool value) {
                  setState(() {
                    createdArea!.isEnable = value;
                  });
                },
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  const Text("OR"),
                  Switch(
                    value: createdArea != null
                        ? createdArea!.logicalGate == 'OR'
                            ? false
                            : true
                        : false,
                    activeColor: Colors.green,
                    onChanged: (bool value) {
                      setState(() {
                        createdArea!.logicalGate = value == true ? 'AND' : 'OR';
                      });
                    },
                  ),
                  const Text("AND"),
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ElevatedButton(
                      onPressed: (() {
                        _createdAreaSave = AreaData.clone(createdArea!);
                        apiAskForAreaChange();
                        setState(() {
                          actionSetting = true;
                        });
                      }),
                      child: Text(
                          "$changeType ${createdArea != null ? createdArea!.name : ''}")),
                  if (changeType != 'create')
                    ElevatedButton(
                        onPressed: (() {
                          changeType = 'delete';
                          apiAskForAreaChange();
                          setState(() {
                            createdArea = AreaData(
                                id: '',
                                name: 'Deleted',
                                description: 'You can now go home !',
                                userId: '',
                                actionList: [],
                                reactionList: [],
                                isEnable: true,
                                logicalGate: 'OR');
                          });

                          /// UPDATE IT WITH FRAME GESTION
                        }),
                        child: Text(
                            "Delete ${createdArea != null ? createdArea!.name : ''}"))
                ],
              )
            ])
        ],
      ),
    )));
  }
}
