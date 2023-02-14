import 'dart:convert';

import 'package:application/flutter_objects/area_data.dart';
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
  /// Creation state
  int _state = 0;

  /// Creation of an Action state
  int _actionCreationState = 0;

  /// Creation of an Reaction state
  int _reactionCreationState = 0;

  /// Name of the AREA
  String _name = "";

  /// Variable to know if an action has been chosen
  bool _hasAnAction = false;

  /// Variable to know if an action has been chosen
  bool _hasAReaction = false;

  /// Variable to know if an User want to choose an Action
  bool _isChoosingAnAction = false;

  /// Variable to know if an User want to choose a Reaction
  bool _isChoosingAReaction = false;

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

  void displayServices(List<Widget> createVis, int actionOrReaction) {
    for (var temp in serviceDataList) {
      createVis.add(ElevatedButton(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
            side: const BorderSide(width: 3, color: Colors.white),

            /// Change when DB is Up
            primary: Colors.white,
          ),
          onPressed: () {
            setState(() {
              createdAreaContent = <ServiceData>[];
              createdAreaContent.add(ServiceData.clone(temp));
              _createdAreaContentSave = <ServiceData>[];
              _createdActionContentSave = <ServiceData>[];
              _state = 1;
              if (actionOrReaction == 1) {
                _actionCreationState = 1;
              }
              if (actionOrReaction == 2) {
                _actionCreationState = 1;
              }
            });
          },
          child: temp.display()));
      createVis.add(
        const SizedBox(
          height: 10,
        ),
      );
    }
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
                'reactionParameters': reactionParameter
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

  /// A display function useful for creation steps
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
      createVis.add(const SizedBox(
        height: 10,
      ));
      createVis.add(createdArea!.displayForCreate(true, createUpdate));
      createVis.add(
        const SizedBox(
          height: 10,
        ),
      );
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
      createVis.add(
        const SizedBox(
          height: 10,
        ),
      );
      createVis.add(createdAreaContent[1]
          .reactions[0]
          .display(true, reactionParameterContent, createUpdate));
      createVis.add(
        const SizedBox(
          height: 10,
        ),
      );
      createVis.add(ElevatedButton(
          onPressed: () {
            setState(() {
              bool isRequired = true;
              _createdAreaContentSave =
                  createdAreaContent.map((v) => ServiceData.clone(v)).toList();
              for (var temp in createdAreaContent[1].reactions[0].parameters) {
                if (temp.isRequired && temp.matchedContent!.value == "") {
                  isRequired = false;
                }
              }
              if (isRequired) {
                _state = 6;
              }
            });
          },
          child: const Text("Validate")));
    }

    if (_state == 4) {
      createVis.add(const Text("Choose your Reaction"));
      for (var temp in createdAreaContent[1].reactions) {
        createVis.add(
          const SizedBox(
            height: 10,
          ),
        );
        createVis.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),
              // Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdAreaContentSave = createdAreaContent
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
                _state = 5;
              });
            },
            child: temp.display(false, [], createUpdate)));
        createVis.add(
          const SizedBox(
            height: 10,
          ),
        );
      }
    }

    if (_state == 3) {
      createVis.add(const Text("Choose your Reaction service"));
      for (var temp in serviceDataList) {
        createVis.add(
          const SizedBox(
            height: 10,
          ),
        );
        createVis.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),
              // Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdAreaContentSave = createdAreaContent
                    .map((v) => ServiceData.clone(v))
                    .toList();
                createdAreaContent.add(ServiceData.clone(temp));
                _state = 4;
              });
            },
            child: temp.display()));
        createVis.add(
          const SizedBox(
            height: 10,
          ),
        );
      }
    }

    if (_state == 2) {
      createVis.add(const Text("Configure your Action"));
      createVis.add(
        const SizedBox(
          height: 10,
        ),
      );
      createVis.add(createdAreaContent[0]
          .actions[0]
          .display(true, actionParameterContent, createUpdate));
      createVis.add(
        const SizedBox(
          height: 10,
        ),
      );
      createVis.add(ElevatedButton(
          onPressed: () {
            setState(() {
              bool isRequired = true;
              _createdAreaContentSave =
                  createdAreaContent.map((v) => ServiceData.clone(v)).toList();
              for (var temp in createdAreaContent[0].actions[0].parameters) {
                if (temp.isRequired && temp.matchedContent!.value == "") {
                  isRequired = false;
                }
              }
              if (isRequired) {
                _state = 3;
              }
            });
          },
          child: const Text("Validate")));
    }

    if (_state == 1) {
      createVis.add(Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const <Widget>[Text("Choose your Action")]));
      createVis.add(
        const SizedBox(
          height: 30,
        ),
      );
      for (var temp in createdAreaContent[0].actions) {
        createVis.add(ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
              side: const BorderSide(width: 3, color: Colors.white),

              /// Change when DB is Up
              primary: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _createdAreaContentSave = createdAreaContent
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
                _state = 2;
              });
            },
            child: temp.display(false, [], createUpdate)));
        createVis.add(
          const SizedBox(
            height: 10,
          ),
        );
      }
    }

    if (_state == 0) {
      displayServices(createVis, 0);
    }
    return createVis;
  }

  /// Initialization function for the api answer
  Future<String> getAFirstApiAnswer() async {
    return '';
  }

  List<Widget> chooseAnAction() {
    List<Widget> createAnAction = <Widget>[];

    if (_isChoosingAnAction == true && _actionCreationState == 0) {
      displayServices(createAnAction, 1);
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
            child: const Text('Add an Action', style: TextStyle(color: Colors.black),)),
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
            child: const Text('Add a Reaction', style: TextStyle(color: Colors.black),)),
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
                      _state = 0;
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
          const Text('Action', style: TextStyle(fontSize: 20),),
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
          const Text('Reaction', style: TextStyle(fontSize: 20),),
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
