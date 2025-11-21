import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';

const BACKEND_URL = "http://127.0.0.1:8000";

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

class IncompleteItemsPage extends StatefulWidget {
  const IncompleteItemsPage({super.key});

  @override
  State<IncompleteItemsPage> createState() => _IncompleteItemsPageState();
}

class _IncompleteItemsPageState extends State<IncompleteItemsPage> {
  String? selectedCourse; // null이면 전체

  Future<List<CourseItem>> fetchIncompleteItems() async {
    final uid = Supabase.instance.client.auth.currentUser!.id;

    final res = await http.get(
      Uri.parse("$BACKEND_URL/course_items?user_id=$uid"),
    );

    final List data = jsonDecode(res.body);

    return data
        .map((e) => CourseItem.fromJson(e))
        .where((e) => e.isIncomplete == true)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("미완료 항목 (테스트 화면)")),
      body: FutureBuilder<List<CourseItem>>(
        future: fetchIncompleteItems(),
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text("에러: ${snapshot.error}"));
          }

          final items = snapshot.data ?? [];
          if (items.isEmpty) {
            return const Center(child: Text("미완료 항목이 없습니다."));
          }

          // 1) 과목 목록 뽑기(중복 제거)
          final courses = items.map((e) => e.courseTitle).toSet().toList()..sort();

          // 2) 선택 과목 기준 필터링
          final filteredItems = (selectedCourse == null)
              ? items
              : items.where((e) => e.courseTitle == selectedCourse).toList();

          return Column(
            children: [
              // ==========================
              //  상단: 과목 버튼(고정폭/스크롤)
              // ==========================
              SizedBox(
                height: 64,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  children: [
                    _CourseButton(
                      label: "전체",
                      selected: selectedCourse == null,
                      onTap: () => setState(() => selectedCourse = null),
                    ),
                    const SizedBox(width: 8),
                    ...courses.map((c) {
                      final isSelected = selectedCourse == c;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: _CourseButton(
                          label: c,
                          selected: isSelected,
                          onTap: () {
                            setState(() {
                              selectedCourse = isSelected ? null : c;
                            });
                          },
                        ),
                      );
                    }),
                  ],
                ),
              ),

              const Divider(height: 1),

              // ======================
              //  하단: 필터된 미완료 리스트
              // ======================
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: filteredItems.length,
                  separatorBuilder: (_, __) => const Divider(),
                  itemBuilder: (context, i) {
                    final it = filteredItems[i];
                    return ListTile(
                      leading: const Icon(Icons.pending_actions),
                      title: Text(it.itemTitle),
                      subtitle: Text(
                        "${it.courseTitle}\n"
                        "종류: ${it.itemType}\n"
                        "${it.rawDueText != null ? "마감: ${it.rawDueText}" : ""}",
                      ),
                      isThreeLine: true,
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

// ==========================
//  고정폭 과목 버튼 위젯
// ==========================
class _CourseButton extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _CourseButton({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 92, // ★ 고정폭
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? Colors.indigo.shade500 : Colors.grey.shade300,
          borderRadius: BorderRadius.circular(12),
          boxShadow: selected
              ? [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.12),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  )
                ]
              : null,
        ),
        child: Center(
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis, // ★ 길면 ...
            textAlign: TextAlign.center,
            style: TextStyle(
              color: selected ? Colors.white : Colors.black87,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ),
      ),
    );
  }
}
