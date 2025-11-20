import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;

// 데이터 모델
class CalendarDay {
  final String date;
  final List<String> events;

  CalendarDay({required this.date, required this.events});

  factory CalendarDay.fromJson(Map<String, dynamic> json) {
    return CalendarDay(
      date: json['date'],
      events: List<String>.from(json['events']),
    );
  }
}

// JSON 로드 함수
Future<List<CalendarDay>> loadCalendarData() async {
  final jsonString = await rootBundle.loadString('calendar.json');
  print('Loaded JSON string: $jsonString');
  final List<dynamic> jsonData = json.decode(jsonString);
  return jsonData.map((e) => CalendarDay.fromJson(e)).toList();
}

// 메인 화면
class CalendarPage extends StatefulWidget {
  @override
  _CalendarPageState createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  late Future<List<CalendarDay>> calendarFuture;

  @override
  void initState() {
    super.initState();
    calendarFuture = loadCalendarData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('캘린더 일정'),
      ),
      body: FutureBuilder<List<CalendarDay>>(
        future: calendarFuture,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return Center(child: CircularProgressIndicator());
          }

          final days = snapshot.data!;

          return ListView.builder(
            itemCount: days.length,
            itemBuilder: (context, index) {
              final day = days[index];

              return Card(
                margin: EdgeInsets.all(10),
                child: ExpansionTile(
                  title: Text(day.date, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  children: day.events.isEmpty
                      ? [Padding(padding: EdgeInsets.all(10), child: Text('일정 없음'))]
                      : day.events
                          .map((e) => ListTile(
                                title: Text(e),
                              ))
                          .toList(),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
