import 'package:flutter/material.dart';

class NewsLetterData {
  String title;
  String content;
  DateTime createdAt;
  String author;

  NewsLetterData(
      {required this.title,
      required this.content,
      required this.createdAt,
      required this.author});

  factory NewsLetterData.fromJson(Map<String, dynamic> json) {
    return NewsLetterData(
        title: json['title'],
        content: json['content'],
        createdAt: DateTime.parse(json['createdAt']),
        author: json['createdBy']);
  }

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
