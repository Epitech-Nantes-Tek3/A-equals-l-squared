import 'package:application/language/language_deutsch.dart';
import 'package:application/language/language_english.dart';
import 'package:application/language/language_french.dart';
import 'package:application/language/language_spanish.dart';

/// List of all available language in the application
List<String> availableLanguage = ["Francais", "English", "Española", "Deutsch"];

/// Current selected language
String selectedLanguage = "English";

/// Global map storing translated string in all language
Map<String, dynamic> languageMap = Map.unmodifiable({
  'Francais': frenchLanguageMap,
  "English": englishLanguageMap,
  "Española": spanishLanguageMap,
  "Deutsch": deutschLanguageMap
});

/// Utility function returning a String in the selected language by her code.
/// All the codes are listed in the file: language_code.dart
/// And their equivalent in the different language files of this folder
String getSentence(String code) {
  try {
    return languageMap[selectedLanguage][code];
  } catch (err) {
    try {
      return languageMap["English"][code];
    } catch (err) {
      try {
        return languageMap[selectedLanguage]["EXCEPT-01"];
      } catch (err) {
        return "Translation file have been corrupted";
      }
    }
  }
}
