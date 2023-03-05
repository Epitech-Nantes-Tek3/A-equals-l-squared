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
}
