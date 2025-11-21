import os
from supabase import create_client, Client
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# ============================================
# 환경변수 불러오기
# ============================================
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if SUPABASE_URL is None:
    raise ValueError("환경변수 SUPABASE_URL 이 설정되지 않았습니다.")

if SUPABASE_SERVICE_ROLE_KEY is None:
    raise ValueError("환경변수 SUPABASE_SERVICE_ROLE_KEY 이 설정되지 않았습니다.")


# ============================================
# Supabase 클라이언트 생성
# (Service Role Key 사용 → DB insert/update 가능)
# ============================================
supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
)
