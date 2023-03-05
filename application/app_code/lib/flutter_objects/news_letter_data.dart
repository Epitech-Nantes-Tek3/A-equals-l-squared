import 'package:flutter/material.dart';

/// This class is the newsLetter class
/// It contains all information about a newsLetter
class NewsLetterData {
  String title;
  String content;
  DateTime createdAt;
  String author;

  /// Constructor of the newsLetter class
  NewsLetterData(
      {required this.title,
      required this.content,
      required this.createdAt,
      required this.author});

  /// Convert a json map into the class
  factory NewsLetterData.fromJson(Map<String, dynamic> json) {
    return NewsLetterData(
        title: json['title'],
        content: json['content'],
        createdAt: DateTime.parse(json['createdAt']),
        author: json['createdBy']);
  }

  /// Function returning a visual representation of a newsLetter
  Widget display(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(
            title,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(color: Theme.of(context).secondaryHeaderColor),
          ),
          Text(
            "$author:${createdAt.toString()}",
            overflow: TextOverflow.ellipsis,
            style: TextStyle(color: Theme.of(context).secondaryHeaderColor),
          ),
        ]),
        Text(
          content,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(color: Theme.of(context).secondaryHeaderColor),
        ),
      ],
    );
  }
}
