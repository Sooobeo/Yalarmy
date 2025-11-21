import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';

const BACKEND_URL = "http://127.0.0.1:8000"; // 네 백엔드 주소

class CourseItem {
  final String courseTitle;
  final String itemTitle;
  final String itemType;
  final String? rawDueText;
  final bool isIncomplete;

  CourseItem({
    required this.courseTitle,
    required this.itemTitle,
    required this.itemType,
    required this.isIncomplete,
    this.rawDueText,
  });

  factory CourseItem.fromJson(Map<String, dynamic> j) {
    return CourseItem(
      courseTitle: j["course_title"] ?? "",
      itemTitle: j["item_title"] ?? "",
      itemType: j["item_type"] ?? "",
      rawDueText: j["raw_due_text"],
      isIncomplete: j["is_incomplete"] == true,
    );
  }
}

class IncompleteItemsPage extends StatelessWidget {
  const IncompleteItemsPage({super.key});

  Future<List<CourseItem>> fetchIncompleteItems() async {
    final uid = Supabase.instance.client.auth.currentUser!.id;

    final res = await http.get(
      Uri.parse("$BACKEND_URL/course_items?user_id=$uid"),
    );

    final List data = jsonDecode(res.body);
    return data.map((e) => CourseItem.fromJson(e)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("미완료 항목 (RunE-Us 파싱)")),
      body: FutureBuilder<List<CourseItem>>(
        future: fetchIncompleteItems(),
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Text("에러: ${snapshot.error}"),
            );
          }

          final items = snapshot.data ?? [];
          if (items.isEmpty) {
            return const Center(child: Text("미완료 항목이 없습니다."));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(12),
            itemCount: items.length,
            separatorBuilder: (_, __) => const Divider(),
            itemBuilder: (context, i) {
              final it = items[i];
              return ListTile(
                title: Text(it.itemTitle),
                subtitle: Text("${it.courseTitle} • ${it.itemType}"
                    "${it.rawDueText != null ? "\n마감: ${it.rawDueText}" : ""}"),
                leading: const Icon(Icons.pending_actions),
              );
            },
          );
        },
      ),
    );
  }
}
