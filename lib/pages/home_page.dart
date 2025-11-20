import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final supabase = Supabase.instance.client;

  bool _isLoading = false;
  List<Map<String, dynamic>> _courses = [];

  @override
  void initState() {
    super.initState();
    _loadCourses();
  }

  Future<void> _loadCourses() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final user = supabase.auth.currentUser;
      if (user == null) {
        // 이론상 여기 오면 안 되지만 혹시 모르니
        return;
      }

      final data = await supabase
          .from('courses')
          .select()
          .eq('user_id', user.id)
          .order('created_at');

      setState(() {
        _courses = List<Map<String, dynamic>>.from(data);
      });
    } catch (e) {
      // 에러 뜨면 콘솔로라도 보기
      // ignore: avoid_print
      print('loadCourses error: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('과목 불러오기 실패 ㅠㅠ')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _showAddCourseDialog() async {
    final nameController = TextEditingController();
    final professorController = TextEditingController();
    final semesterController = TextEditingController(text: '2025-1');

    final result = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('과목 추가'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(
                  labelText: '과목명',
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: professorController,
                decoration: const InputDecoration(
                  labelText: '교수명 (선택)',
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: semesterController,
                decoration: const InputDecoration(
                  labelText: '학기 (예: 2025-1)',
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('취소'),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('추가'),
            ),
          ],
        );
      },
    );

    if (result != true) return;

    final name = nameController.text.trim();
    if (name.isEmpty) return;

    try {
      final user = supabase.auth.currentUser;
      if (user == null) return;

      await supabase.from('courses').insert({
        'user_id': user.id,
        'name': name,
        'professor': professorController.text.trim().isEmpty
            ? null
            : professorController.text.trim(),
        'semester': semesterController.text.trim(),
      });

      await _loadCourses();
    } catch (e) {
      // ignore: avoid_print
      print('insert course error: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('과목 추가 실패 ㅠㅠ')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = supabase.auth.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Yalarmy 과목 목록'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadCourses,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await supabase.auth.signOut();
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddCourseDialog,
        child: const Icon(Icons.add),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '현재 사용자: ${user?.email ?? '알 수 없음'}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 8),
                  if (_courses.isEmpty)
                    const Expanded(
                      child: Center(
                        child: Text('등록된 과목이 없습니다.\n오른쪽 아래 + 버튼으로 추가해보세요.'),
                      ),
                    )
                  else
                    Expanded(
                      child: ListView.builder(
                        itemCount: _courses.length,
                        itemBuilder: (context, index) {
                          final c = _courses[index];
                          return Card(
                            child: ListTile(
                              title: Text(c['name'] ?? '이름 없음'),
                              subtitle: Text(
                                [
                                  if (c['professor'] != null)
                                    '교수: ${c['professor']}',
                                  if (c['semester'] != null)
                                    '학기: ${c['semester']}',
                                ].join('  ·  '),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                ],
              ),
      ),
    );
  }
}
