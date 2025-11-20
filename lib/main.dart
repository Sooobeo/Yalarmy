import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'pages/auth_page.dart';
import 'pages/home_page.dart';

// ⚠️ 여기에 네 Supabase 프로젝트 URL / anon key 넣기
const supabaseUrl = 'https://sguedpyifsjqzjhdaqzb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndWVkcHlpZnNqcXpqaGRhcXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzE1NDYsImV4cCI6MjA3NTYwNzU0Nn0.iggfDZwVS9E2MhTIl-9gRDVLZ4ermKCoW43mL-fAl7Q';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Supabase 초기화
  await Supabase.initialize(
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final supabase = Supabase.instance.client;

    return MaterialApp(
      title: 'Yalarmy',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
      ),
      home: StreamBuilder<AuthState>(
        stream: supabase.auth.onAuthStateChange,
        builder: (context, snapshot) {
          final session = supabase.auth.currentSession;
          if (session == null) {
            return const AuthPage();
          } else {
            return const HomePage();
          }
        },
      ),
    );
  }
}
