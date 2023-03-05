import 'package:application/flutter_objects/area_data.dart';
import 'package:application/language/language.dart';
import 'package:application/network/informations.dart';
import 'package:application/night_mod/night_mod.dart';
import 'package:application/pages/create_area/create_area_functional.dart';
import 'package:application/pages/home/home_functional.dart';
import 'package:application/pages/service_list/service_list_functional.dart';
import 'package:application/pages/settings/settings_functional.dart';
import 'package:application/pages/update_area/update_area_functional.dart';
import 'package:flutter/material.dart';

import '../../flutter_objects/area_data.dart';
import '../../material_lib_functions/material_functions.dart';
import '../login/login_page.dart';
import 'home_page.dart';

class HomePageState extends State<HomePage> {
  /// Update state function
  void update() {
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    updatePage = update;
  }

  /// Re sync all flutter object
  void homeSync() async {
    await updateAllFlutterObject();
    update();
  }

  /// This function Create an Elevated Button thanks to an Area
  Widget areaDataToElevatedButton(
      AreaData areaData, Color areaPrimaryColor, Color areaBorderColor) {
    return materialElevatedButtonArea(
      ElevatedButton(
          onPressed: () {
            createdArea = AreaData.clone(areaData);
            goToUpdateAreaPage(context);
          },
          child: areaData.display(false, null, false, false, context)),
      context,
      sizeOfButton: 2.5,
      isShadowNeeded: true,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 10,
      borderWith: 3,
      primaryColor: areaPrimaryColor == Colors.black && nightMode == false
          ? Colors.white
          : areaPrimaryColor == Colors.white && nightMode == true
              ? Colors.black
              : areaPrimaryColor,
      borderColor: areaBorderColor,
    );
  }

  /// This function create a Row of two Areas
  Widget createRowOfAreas(Widget firstArea, Widget? secondArea) {
    Widget rowArea = Row(
        mainAxisAlignment: secondArea != null
            ? MainAxisAlignment.spaceBetween
            : MainAxisAlignment.center,
        children: <Widget>[
          firstArea,
          if (secondArea != null) secondArea,
        ]);
    return rowArea;
  }

  /// This function display all Areas in Tab
  List<Widget> createTabOfAreas() {
    List<Widget> areaVis = <Widget>[];
    late AreaData tempArea;
    var count = 1;

    for (var temp in areaDataList) {
      if (count % 2 == 0 && count != 0) {
        areaVis.add(createRowOfAreas(
            areaDataToElevatedButton(tempArea, tempArea.getPrimaryColor(),
                tempArea.getSecondaryColor()),
            areaDataToElevatedButton(
                temp, temp.getPrimaryColor(), temp.getSecondaryColor())));
        areaVis.add(const SizedBox(
          height: 30,
        ));
      }
      tempArea = temp;
      count++;
    }
    if (count % 2 == 0) {
      areaVis.add(createRowOfAreas(
          areaDataToElevatedButton(tempArea, tempArea.getPrimaryColor(),
              tempArea.getSecondaryColor()),
          null));
    }
    return areaVis;
  }

  @override
  Widget build(BuildContext context) {
    if (logout || userInformation == null) {
      userInformation = null;
      return const LoginPage();
    } else {
      return Scaffold(
          resizeToAvoidBottomInset: true,
          body: SingleChildScrollView(
              child: Center(
                  child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 30, vertical: 30),
            child: SizedBox(
              width:
                  isDesktop(context) ? 600 : MediaQuery.of(context).size.width,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      IconButton(
                          iconSize: 30,
                          onPressed: () {
                            setState(() {
                              goToSettingsPage(context);
                            });
                          },
                          icon: const Icon(Icons.settings)),
                      IconButton(
                          iconSize: 30,
                          onPressed: () {
                            homeSync();
                          },
                          icon: Image.asset('assets/icons/Area_Logo.png')),
                      IconButton(
                          iconSize: 30,
                          onPressed: () {
                            setState(() {
                              goToCreateAreaPage(context);
                            });
                          },
                          icon: const Icon(Icons.add))
                    ],
                  ),
                  const SizedBox(height: 30),
                  Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(getSentence('HOME-01'),
                            style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 28,
                                fontFamily: 'Roboto-Bold')),
                        const SizedBox(height: 10),
                        TextFormField(
                          decoration: InputDecoration(
                            border: const OutlineInputBorder(),
                            labelText: getSentence('HOME-03'),
                          ),
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          validator: (String? value) {
                            if (value == null) {
                              return null;
                            }
                            return null;
                          },
                          onChanged: (value) {
                            sortAreaDataList(value);
                            setState(() {});
                          },
                        ),
                      ]),
                  const SizedBox(
                    height: 30,
                  ),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: createTabOfAreas(),
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  materialElevatedButtonArea(
                    ElevatedButton(
                      key: const Key('HomeServiceButton'),
                      onPressed: () {
                        setState(() {
                          goToServiceListPage(context);
                        });
                      },
                      child: Text(getSentence('HOME-02')),
                    ),
                    context,
                    sizeOfButton: 4,
                    primaryColor: getOurBlueAreaColor(100),
                  ),
                ],
              ),
            ),
          ))));
    }
  }
}
