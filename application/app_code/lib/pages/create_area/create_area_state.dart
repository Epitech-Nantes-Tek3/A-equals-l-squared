import 'dart:convert';

import 'package:application/flutter_objects/parameter_data.dart';
import 'package:application/pages/create_area/create_area_functional.dart';
import 'package:application/pages/create_area/create_area_page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../material_lib_functions/material_functions.dart';
import '../../flutter_objects/action_data.dart';
import '../../flutter_objects/area_data.dart';
import '../../flutter_objects/reaction_data.dart';
import '../../flutter_objects/service_data.dart';
import '../../network/informations.dart';
import '../home/home_functional.dart';

class CreateAreaPageState extends State<CreateAreaPage> {
  /// Setting of the action set ?
  bool actionSetting = false;

  static const List<Widget> listActionCondition = <Widget>[
    Text('Or'),
    Text('And')
  ];

  /// Creation of an Action state
  int _actionCreationState = 0;

  bool isSelected = false;

  final List<bool> _selectedActionCondition = createdArea != null
      ? createdArea!.logicalGate == 'OR'
          ? <bool>[true, false]
          : <bool>[false, true]
      : <bool>[true, false];

  /// Creation of an Reaction state
  int _reactionCreationState = 0;

  /// Variable to know if at least one Action is save on your Area
  bool _isDisplayActions = true;

  /// Variable to know if at least one Reaction is save on your Area
  bool _isDisplayReactions = true;

  /// To know if all previews Reaction must be closed
  bool _isReactionPreviewClosed = false;

  /// To know if all previews Action must be closed
  bool _isActionPreviewClosed = false;

  /// Variable to know if an User want to choose an Action
  bool _isChoosingAnAction = false;

  /// Variable to know if an User want to choose a Reaction
  bool _isChoosingAReaction = false;

  /// Save of the creation state
  AreaData? _createdAreaSave;

  /// An api error message
  String? _apiErrorMessage;

  void updateIsActionPreviewClosed() {
    _isActionPreviewClosed = false;
  }

  void updateIsReactionPreviewClosed() {
    _isReactionPreviewClosed = false;
  }

  /// Useful function updating the state
  /// object -> Object who's calling the function
  void createUpdate(ParameterData? object) async {
    if (object != null) {
      await object.getProposalValue();
    }
    setState(() {});
  }

  void leavePage() {
    goToHomePage(context);
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
        actionSetting = false;
        createdArea!.isEnable = false;
        _apiErrorMessage = response.body;
        createUpdate(null);
        return 'Error during area $changeType';
      }
      _apiErrorMessage = null;
      if (changeType == 'create') {
        createdArea = AreaData.fromJson(jsonDecode(response.body));
      }
      await updateAllFlutterObject();
      if (changeType == 'delete') {
        leavePage();
        return 'Area successfully $changeType !';
      }
      createUpdate(null);
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
        _apiErrorMessage = response.body;
        _isChoosingAnAction = true;
        createUpdate(null);
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
      }
      _apiErrorMessage = null;
      createUpdate(null);
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
        _apiErrorMessage = response.body;
        _isChoosingAReaction = true;
        createUpdate(null);
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
      }
      _apiErrorMessage = null;
      createUpdate(null);
      await updateAllFlutterObject();
      return 'Reaction successfully $changeType !';
    } catch (err) {
      return 'Error during area $changeType';
    }
  }

  /// This function display the configuration Action widget view
  Widget configureAnActionDisplay() {
    Widget modifyAnAction = Column(
      children: [
        const Text(
          "Configure your Action",
          style: TextStyle(fontSize: 14),
        ),
        const SizedBox(
          height: 10,
        ),
        createdArea!.actionList.last.displayActionModificationView(
            createUpdate, _isActionPreviewClosed),
        const SizedBox(
          height: 20,
        ),
      ],
    );
    return Container(
      padding: const EdgeInsets.all(10.0),
      decoration: BoxDecoration(
          color: Colors.transparent,
          border: Border.all(color: Colors.black),
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(10.0),
            topRight: Radius.circular(10.0),
            bottomLeft: Radius.circular(10.0),
            bottomRight: Radius.circular(10.0),
          )),
      child: modifyAnAction,
    );
  }

  /// This function display the selection Action widget view
  Widget selectAnActionDisplay() {
    List<Widget> selectAnAction = <Widget>[];
    selectAnAction.add(Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const <Widget>[
          SizedBox(
            height: 30,
          ),
        ]));
    for (var temp in createdArea!.serviceId!.actions) {
      selectAnAction.add(materialElevatedButtonArea(
        ElevatedButton(
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
            child: temp.displayActionDescription()),
        context,
        sizeOfButton: 1.2,
        isShadowNeeded: true,
        paddingVertical: 20,
        paddingHorizontal: 20,
      ));
      selectAnAction.add(
        const SizedBox(
          height: 10,
        ),
      );
    }
    return Column(
      children: selectAnAction,
    );
  }

  /// This function display the selection Service Action widget view
  Widget selectAServiceActionDisplay() {
    List<Widget> selectAServiceAction = <Widget>[];

    for (var temp in serviceDataList) {
      if (temp.actions.isEmpty) {
        continue;
      }
      selectAServiceAction.add(
        const SizedBox(
          height: 10,
        ),
      );
      selectAServiceAction.add(materialElevatedButtonArea(
        ElevatedButton(
            onPressed: () {
              setState(() {
                _createdAreaSave = AreaData.clone(createdArea!);
                createdArea!.serviceId = ServiceData.clone(temp);
                _actionCreationState = 1;
              });
            },
            child: temp.display()),
        context,
        sizeOfButton: 1.2,
        isShadowNeeded: true,
        paddingVertical: 20,
        paddingHorizontal: 20,
      ));
      selectAServiceAction.add(
        const SizedBox(
          height: 10,
        ),
      );
    }
    return Column(
      children: selectAServiceAction,
    );
  }

  /// This function call all function to select a new Action views
  List<Widget> chooseAnAction() {
    List<Widget> createAnAction = <Widget>[];

    /// Select a Service Action
    if (_isChoosingAnAction == true && _actionCreationState == 0) {
      createAnAction.add(Row(
        children: const [
          Text('Add a new Action : Choose your Service',
              style: TextStyle(fontSize: 16)),
        ],
      ));
      createAnAction.add(selectAServiceActionDisplay());
    }

    ///Select an Action
    if (_actionCreationState == 1) {
      createAnAction.add(Row(
        children: const [
          Text('Add a new Action : Choose your Action',
              style: TextStyle(fontSize: 16)),
        ],
      ));
      createAnAction.add(selectAnActionDisplay());
    }

    /// Configure the chosen Action
    if (_actionCreationState == 2) {
      createAnAction.add(Row(
        children: const [
          Text('Add a new Action : Configure your new Action',
              style: TextStyle(fontSize: 16)),
        ],
      ));
      createAnAction.add(configureAnActionDisplay());
    }

    /// Buttons
    if (_isChoosingAnAction) {
      createAnAction
          .add(Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
        materialElevatedButtonArea(
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
            child: Text('Previous',
                style: TextStyle(color: getOurBlueAreaColor(100))),
          ),
          context,
          borderColor: getOurBlueAreaColor(100),
          borderWith: 2,
          isShadowNeeded: true,
        ),
        if (_actionCreationState == 2)
          materialElevatedButtonArea(
            ElevatedButton(
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
                child: const Text("Validate",
                    style: TextStyle(color: Colors.white))),
            context,
            primaryColor: getOurBlueAreaColor(100),
            borderWith: 1,
            borderColor: getOurBlueAreaColor(100),
            isShadowNeeded: true,
          ),
      ]));
    }
    return createAnAction;
  }

  /// This function display new selection Action view (create an Action and the selection of a new Action)
  Widget displayNewActionSelectionView() {
    return Column(children: <Widget>[
      if (!_isChoosingAnAction)
        materialElevatedButtonArea(
          ElevatedButton(
              onPressed: () {
                setState(() {
                  _isChoosingAnAction = true;
                  _actionCreationState = 0;
                  _isActionPreviewClosed = true;
                });
              },
              child: const Text(
                'Add an Action',
                style: TextStyle(color: Colors.white),
              )),
          context,
          sizeOfButton: 1.8,
          primaryColor: getOurBlueAreaColor(100),
          borderWith: 1,
          borderColor: getOurBlueAreaColor(100),
          isShadowNeeded: true,

          /// Add button desc
        ),
      if (_isChoosingAnAction)
        Column(
          children: <Widget>[
            Column(children: chooseAnAction()),
          ],
        )
    ]);
  }

  /// This function display the configuration Reaction widget view
  Widget configureAReactionDisplay() {
    Widget modifyAReaction =
        Column(crossAxisAlignment: CrossAxisAlignment.center, children: [
      createdArea!.reactionList.last.displayReactionModificationView(
          createUpdate, _isReactionPreviewClosed),
      const SizedBox(
        height: 10,
      ),
      materialElevatedButtonArea(
        ElevatedButton(
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
            child:
                const Text("Validate", style: TextStyle(color: Colors.black))),
        context,
        primaryColor: getOurBlueAreaColor(100),
        borderWith: 1,
        borderColor: getOurBlueAreaColor(100),
        isShadowNeeded: true,
      )
    ]);
    return Container(
      padding: const EdgeInsets.all(10.0),
      decoration: BoxDecoration(
          color: Colors.transparent,
          border: Border.all(color: Colors.black),
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(10.0),
            topRight: Radius.circular(10.0),
            bottomLeft: Radius.circular(10.0),
            bottomRight: Radius.circular(10.0),
          )),
      child: modifyAReaction,
    );
  }

  /// This function display the selection Reaction widget view
  Widget selectAReactionDisplay() {
    List<Widget> selectAReaction = <Widget>[];

    selectAReaction.add(
      const SizedBox(
        height: 30,
      ),
    );
    for (var temp in createdArea!.serviceId!.reactions) {
      selectAReaction.add(materialElevatedButtonArea(
        ElevatedButton(
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
            child: temp.displayReactionDescription()),
        context,
        sizeOfButton: 1.2,
        isShadowNeeded: true,
        paddingVertical: 20,
        paddingHorizontal: 20,
      ));
      selectAReaction.add(
        const SizedBox(
          height: 10,
        ),
      );
    }

    return Column(
      children: selectAReaction,
    );
  }

  /// This function display the selection Service Reaction widget view
  Widget selectAServiceReactionDisplay() {
    List<Widget> selectAServiceReaction = <Widget>[];

    for (var temp in serviceDataList) {
      if (temp.reactions.isEmpty) {
        continue;
      }
      selectAServiceReaction.add(
        const SizedBox(
          height: 10,
        ),
      );
      selectAServiceReaction.add(materialElevatedButtonArea(
        ElevatedButton(
            onPressed: () {
              setState(() {
                _createdAreaSave = AreaData.clone(createdArea!);
                createdArea!.serviceId = ServiceData.clone(temp);
                _reactionCreationState = 1;
              });
            },
            child: temp.display()),
        context,
        sizeOfButton: 1.2,
        isShadowNeeded: true,
        paddingVertical: 20,
        paddingHorizontal: 20,
      ));
      selectAServiceReaction.add(
        const SizedBox(
          height: 10,
        ),
      );
    }
    return Column(
      children: selectAServiceReaction,
    );
  }

  /// This function call all function to select a new Reaction views
  List<Widget> chooseAReaction() {
    List<Widget> createAReaction = <Widget>[];

    createAReaction.add(const SizedBox(
      height: 30,
    ));

    /// Select a Service Reaction
    if (_isChoosingAReaction == true && _reactionCreationState == 0) {
      createAReaction.add(Row(
        children: const [
          Text('Add a new Reaction : Select a Service',
              style: TextStyle(fontSize: 16)),
        ],
      ));
      createAReaction.add(selectAServiceReactionDisplay());
    }

    /// Select a Reaction
    if (_reactionCreationState == 1) {
      createAReaction.add(Row(
        children: const [
          Text('Add a new Reaction : Reaction selection',
              style: TextStyle(fontSize: 16)),
        ],
      ));
      createAReaction.add(selectAReactionDisplay());
    }

    /// Configure a Reaction
    if (_reactionCreationState == 2) {
      createAReaction.add(Row(
        children: const [
          Text('Add a new Reaction : Reaction configuration',
              style: TextStyle(fontSize: 16)),
        ],
      ));
      createAReaction.add(configureAReactionDisplay());
    }

    /// Buttons
    if (_isChoosingAReaction) {
      createAReaction
          .add(Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
        materialElevatedButtonArea(
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
            child: Text('Previous',
                style: TextStyle(color: getOurBlueAreaColor(100))),
          ),
          context,
          borderColor: getOurBlueAreaColor(100),
          borderWith: 2,
          isShadowNeeded: true,
        )
      ]));
    }
    return createAReaction;
  }

  /// This function display new selection Reaction view (create a Reaction and the selection of a new Reaction)
  Widget displayNewReactionSelectionView() {
    return Column(children: <Widget>[
      if (!_isChoosingAReaction)
        materialElevatedButtonArea(
          ElevatedButton(
              onPressed: () {
                setState(() {
                  _isChoosingAReaction = true;
                  _reactionCreationState = 0;
                  _isReactionPreviewClosed = true;
                });
              },
              child: const Text(
                'Add a Reaction',
                style: TextStyle(color: Colors.white),
              )),
          context,
          sizeOfButton: 1.8,
          primaryColor: getOurBlueAreaColor(100),
          borderWith: 1,
          borderColor: getOurBlueAreaColor(100),
          isShadowNeeded: true,
        ),
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

    /// Get actionListDisplay
    if (createdArea != null && createdArea!.actionList.isNotEmpty) {
      for (var temp in createdArea!.actionList) {
        if (_actionCreationState != 2 || temp != createdArea!.actionList.last) {
          actionListDisplay.add(Container(
              padding: const EdgeInsets.all(10.0),
              decoration: BoxDecoration(
                  color: Colors.transparent,
                  border: Border.all(color: Colors.black),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(10.0),
                    topRight: Radius.circular(10.0),
                    bottomLeft: Radius.circular(10.0),
                    bottomRight: Radius.circular(10.0),
                  )),
              child: Column(children: [
                temp.displayActionModificationView(
                    createUpdate, _isActionPreviewClosed),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    materialElevatedButtonArea(
                      ElevatedButton(
                          onPressed: () {
                            changeType = 'delete';
                            apiAskForActionChange(temp);
                            setState(() {
                              createdArea!.actionList.remove(temp);
                            });
                          },
                          child: Text('Delete',
                              style:
                                  TextStyle(color: getOurBlueAreaColor(100)))),
                      context,
                      borderColor: getOurBlueAreaColor(100),
                      borderWith: 2,
                      isShadowNeeded: true,
                    ),
                    materialElevatedButtonArea(
                      ElevatedButton(
                        onPressed: () {
                          changeType = 'update';
                          apiAskForActionChange(temp);
                        },
                        child: const Text('Update',
                            style: TextStyle(color: Colors.white)),
                      ),
                      context,
                      primaryColor: getOurBlueAreaColor(100),
                      borderWith: 1,
                      borderColor: getOurBlueAreaColor(100),
                      isShadowNeeded: true,
                    ),
                  ],
                )
              ])));
          actionListDisplay.add(const SizedBox(
            height: 20,
          ));
        }
      }
      updateIsActionPreviewClosed();
    }

    /// Get reactionListDisplay
    if (createdArea != null && createdArea!.reactionList.isNotEmpty) {
      for (var temp in createdArea!.reactionList) {
        if (_reactionCreationState != 2 ||
            temp != createdArea!.reactionList.last) {
          reactionListDisplay.add(Container(
              padding: const EdgeInsets.all(10.0),
              decoration: BoxDecoration(
                  color: Colors.transparent,
                  border: Border.all(color: Colors.black),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(10.0),
                    topRight: Radius.circular(10.0),
                    bottomLeft: Radius.circular(10.0),
                    bottomRight: Radius.circular(10.0),
                  )),
              child: Column(children: [
                temp.displayReactionModificationView(
                    createUpdate, _isReactionPreviewClosed),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    materialElevatedButtonArea(
                      ElevatedButton(
                          onPressed: () {
                            changeType = 'delete';
                            apiAskForReactionChange(temp);
                            setState(() {
                              createdArea!.reactionList.remove(temp);
                            });
                          },
                          child: Text('Delete',
                              style:
                                  TextStyle(color: getOurBlueAreaColor(100)))),
                      context,
                      borderColor: getOurBlueAreaColor(100),
                      borderWith: 2,
                      isShadowNeeded: true,
                    ),
                    materialElevatedButtonArea(
                      ElevatedButton(
                          onPressed: () {
                            changeType = 'update';
                            apiAskForReactionChange(temp);
                          },
                          child: const Text('Update',
                              style: TextStyle(color: Colors.white))),
                      context,
                      primaryColor: getOurBlueAreaColor(100),
                      borderWith: 1,
                      borderColor: getOurBlueAreaColor(100),
                      isShadowNeeded: true,
                    ),
                  ],
                )
              ])));
          reactionListDisplay.add(const SizedBox(
            height: 20,
          ));
        }
      }
      updateIsReactionPreviewClosed();
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
                      icon: const Icon(Icons.home_filled),
                      color: getOurBlueAreaColor(100),
                    ),
                    Text(
                      createdArea != null ? createdArea!.name : '',
                      style: const TextStyle(
                          fontFamily: 'Roboto-Bold', fontSize: 20),
                    )
                  ],
                ),
                const SizedBox(
                  height: 30,
                ),
                if (actionSetting)
                  Column(children: [
                    /// Block Action
                    Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            createdArea!.actionList.length >= 2
                                ? 'Actions'
                                : 'Action',
                            style: const TextStyle(fontSize: 20),
                          ),
                          if (!_isDisplayActions)
                            IconButton(
                                onPressed: () {
                                  setState(() {
                                    _isDisplayActions = true;
                                  });
                                },
                                icon: Icon(
                                  Icons.remove_red_eye_outlined,
                                  color: getOurBlueAreaColor(100),
                                )),
                          if (_isDisplayActions)
                            IconButton(
                                onPressed: () {
                                  setState(() {
                                    _isDisplayActions = false;
                                  });
                                },
                                icon: Icon(
                                  Icons.remove_red_eye,
                                  color: getOurBlueAreaColor(100),
                                  shadows: const [
                                    Shadow(color: Colors.black, blurRadius: 0.4)
                                  ],
                                )),
                        ]),

                    if (_isDisplayActions) Column(children: actionListDisplay),
                    displayNewActionSelectionView(),
                    const SizedBox(
                      height: 30,
                    ),

                    /// Block Reaction
                    Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            createdArea!.reactionList.length >= 2
                                ? 'Reactions'
                                : 'Reaction',
                            style: const TextStyle(fontSize: 20),
                          ),
                          if (!_isDisplayReactions)
                            IconButton(
                                onPressed: () {
                                  setState(() {
                                    _isDisplayReactions = true;
                                  });
                                },
                                icon: Icon(
                                  Icons.remove_red_eye_outlined,
                                  color: getOurBlueAreaColor(100),
                                )),
                          if (_isDisplayReactions)
                            IconButton(
                                onPressed: () {
                                  setState(() {
                                    _isDisplayReactions = false;
                                  });
                                },
                                icon: Icon(
                                  Icons.remove_red_eye,
                                  color: getOurBlueAreaColor(100),
                                  shadows: const [
                                    Shadow(color: Colors.black, blurRadius: 0.4)
                                  ],
                                )),
                        ]),
                    if (false)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("Display Reactions of this Area"),
                          Switch(
                            value: _isDisplayReactions,
                            activeColor: Colors.blue,
                            onChanged: (bool value) {
                              setState(() {
                                _isDisplayReactions = value;
                              });
                            },
                          ),
                        ],
                      ),
                    if (_isDisplayReactions)
                      Column(children: reactionListDisplay),
                    displayNewReactionSelectionView()
                  ])
                else
                  Container(
                      padding: const EdgeInsets.all(10.0),
                      decoration: BoxDecoration(
                          color: Colors.transparent,
                          border: Border.all(color: Colors.black),
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(10.0),
                            topRight: Radius.circular(10.0),
                            bottomLeft: Radius.circular(10.0),
                            bottomRight: Radius.circular(10.0),
                          )),
                      child: Column(children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text("Available"),
                            Switch(
                              value: createdArea != null
                                  ? createdArea!.isEnable
                                  : true,
                              activeColor: Colors.blue,
                              onChanged: (bool value) {
                                setState(() {
                                  createdArea!.isEnable = value;
                                });
                              },
                            ),
                          ],
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        TextFormField(
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            labelText: 'Area Name',
                          ),
                          initialValue:
                              createdArea != null ? createdArea!.name : '',
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: (String? value) {
                            createdArea!.name = value!;
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),
                        TextFormField(
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            labelText: 'Area Description',
                          ),
                          initialValue: createdArea != null
                              ? createdArea!.description
                              : '',
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: (String? value) {
                            createdArea!.description = value!;
                            return null;
                          },
                        ),
                        const SizedBox(height: 20),
                        Column(
                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: <Widget>[
                              // ToggleButtons with a single selection.
                              const Text(
                                  "Condition to activate this Area with many Actions : "),
                              const SizedBox(height: 5),
                              ToggleButtons(
                                direction: isSelected
                                    ? Axis.vertical
                                    : Axis.horizontal,
                                onPressed: (int index) {
                                  setState(() {
                                    // The button that is tapped is set to true, and the others to false.
                                    for (int i = 0;
                                        i < _selectedActionCondition.length;
                                        i++) {
                                      _selectedActionCondition[i] = i == index;
                                    }
                                    createdArea!.logicalGate =
                                        index == 0 ? 'OR' : 'AND';
                                  });
                                },
                                borderRadius:
                                    const BorderRadius.all(Radius.circular(8)),
                                selectedBorderColor: Colors.blue[700],
                                selectedColor: Colors.white,
                                fillColor: Colors.blue[200],
                                color: Colors.blue[400],
                                constraints: const BoxConstraints(
                                  minHeight: 40.0,
                                  minWidth: 80.0,
                                ),
                                isSelected: _selectedActionCondition,
                                children: listActionCondition,
                              ),
                            ]),
                      ])),
                const SizedBox(
                  height: 10,
                ),

                /// Update and delete Area
                if ((changeType == 'update' && !actionSetting) ||
                    changeType == 'create')
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      if (changeType != 'create')
                        materialElevatedButtonArea(
                          ElevatedButton(
                            onPressed: (() {
                              changeType = 'delete';
                              apiAskForAreaChange();
                            }),
                            child: Text(
                                "Delete ${createdArea != null ? createdArea!.name : ''}",
                                style:
                                    TextStyle(color: getOurBlueAreaColor(100))),
                          ),
                          context,
                          isShadowNeeded: true,
                          borderWith: 2,
                          borderColor: getOurBlueAreaColor(100),
                        ),
                      materialElevatedButtonArea(
                        ElevatedButton(
                            onPressed: (() {
                              _createdAreaSave = AreaData.clone(createdArea!);
                              apiAskForAreaChange();
                              setState(() {
                                actionSetting = true;
                              });
                            }),
                            child: Text(
                                "$changeType ${createdArea != null ? createdArea!.name : ''}",
                                style: const TextStyle(color: Colors.white))),
                        context,
                        isShadowNeeded: true,
                        primaryColor: getOurBlueAreaColor(100),
                        borderWith: 1,
                        borderColor: getOurBlueAreaColor(100),
                      ),
                    ],
                  )
              ])),
    ));
  }
}
