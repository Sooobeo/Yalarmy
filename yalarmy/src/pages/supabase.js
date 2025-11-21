import { createClient } from "@supabase/supabase-js";

// ⚠️ 환경변수 또는 하드코딩 중 선택하면 됨.
// 1) 개발 동안은 하드코딩 가능
const SUPABASE_URL = "https://sguedpyifsjqzjhdaqzb.supabase.co"; // 너희 URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndWVkcHlpZnNqcXpqaGRhcXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzE1NDYsImV4cCI6MjA3NTYwNzU0Nn0.iggfDZwVS9E2MhTIl-9gRDVLZ4ermKCoW43mL-fAl7Q"; // anon key

// 2) 또는 환경변수(.env) 사용:
// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
