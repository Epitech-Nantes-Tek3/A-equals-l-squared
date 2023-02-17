import 'package:application/flutter_objects/parameter_data.dart';
import 'package:application/pages/create_area/create_area_functional.dart';
import 'package:application/pages/create_area/create_area_page.dart';
import 'package:flutter/material.dart';

import '../../flutter_objects/action_data.dart';
import '../../flutter_objects/area_data.dart';
import '../../flutter_objects/reaction_data.dart';
import '../../flutter_objects/service_data.dart';
import '../home/home_functional.dart';

class CreateAreaPageState extends State<CreateAreaPage> {
  /// Setting of the action set ?
  bool actionSetting = false;

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
  AreaData? _createdAreaSave;

  /// Useful function updating the state
  /// object -> Object who's calling the function
  void createUpdate(ParameterData object) async {
    await object.getProposalValue();
    setState(() {});
  }

  /// Ask the api to change an area
  Future<String> apiAskForAreaChange() async {
    return 'TO REBASE WITH DB UPDATE';
  }

  /// Ask the api to change an action
  Future<String> apiAskForActionChange(ActionData action) async {
    return 'TO REBASE WITH DB UPDATE';
  }

  /// Ask the api to change a reaction
  Future<String> apiAskForReactionChange(ReactionData reaction) async {
    return 'TO REBASE WITH DB UPDATE';
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
                  createdArea!.actionList.last.parametersContent
                      .add(ParameterContent(paramId: tmp.id, value: ""));
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
                  createdArea!.reactionList.last.parametersContent
                      .add(ParameterContent(paramId: tmp.id, value: ""));
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
          actionListDisplay.add(temp.display(true, createUpdate));
        }
      }
    }

    if (createdArea != null && createdArea!.reactionList.isNotEmpty) {
      for (var temp in createdArea!.reactionList) {
        if (_reactionCreationState != 2 ||
            temp != createdArea!.reactionList.last) {
          reactionListDisplay.add(temp.display(true, createUpdate));
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
              const Text(
                'Create a new Area',
                style: TextStyle(fontFamily: 'Roboto-Bold', fontSize: 20),
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
            Column(
              children: [
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
                ElevatedButton(
                    onPressed: (() {
                      _createdAreaSave = AreaData.clone(createdArea!);
                      apiAskForAreaChange();
                      setState(() {
                        actionSetting = true;
                      });
                    }),
                    child: Text(
                        "$changeType ${createdArea != null ? createdArea!.name : ''}"))
              ],
            )
        ],
      ),
    )));
  }
}
