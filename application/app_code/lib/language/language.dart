/// List of all available language in the application
List<String> availableLanguage = ["Francais", "English", "Española", "Deutsch"];

/// Current selected language
String selectedLanguage = "English";

/// Global map storing translated string in all language
Map<String, dynamic> languageMap = Map.unmodifiable(
    {'Francais': 1, "English": 2, "Española": 3, "Deutsch": 4});

/// Utility function returning a String in the selected language by her code.
/// All the codes are listed in the file: language_code.dart
/// And their equivalent in the different language files of this folder
String getSentence(String code) {
  return '';
}
