// supabase.js

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ⚠️ 해커톤 데모용 — anon key 그냥 박아도 됨.
//    실제 서비스단에서는 Auth + RLS로 잠급니다.

const SUPABASE_URL = "https://sguedpyifsjqzjhdaqzb.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndWVkcHlpZnNqcXpqaGRhcXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzE1NDYsImV4cCI6MjA3NTYwNzU0Nn0.iggfDZwVS9E2MhTIl-9gRDVLZ4ermKCoW43mL-fAl7Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
