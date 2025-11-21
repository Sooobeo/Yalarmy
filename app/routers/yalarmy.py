from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import supabase               # supabase client 로드
import json

router = APIRouter(prefix="/yalarmy", tags=["yalarmy"])


# ============================
# 요청 바디 정의
# ============================
class EnsureUserRequest(BaseModel):
    email: str
    password: str


# ============================
#  POST /yalarmy/ensure-user
#  Supabase 로그인 또는 회원가입
# ============================
@router.post("/ensure-user")
async def ensure_user(body: EnsureUserRequest):
    email = body.email
    password = body.password

    # 1) 로그인 시도
    try:
        res = supabase.auth.sign_in_with_password(
            {"email": email, "password": password}
        )
    except Exception as e:
        print("[ensure-user] 로그인 요청 중 오류:", e)
        raise HTTPException(status_code=500, detail=f"로그인 오류: {str(e)}")

    # sign_in_with_password 결과(res)는 dict 형태. data가 리스트로 올 때가 있음.
    if hasattr(res, "user") and res.user is not None:
        # 로그인 성공
        return {"userKey": res.user.id}

    # 2) 로그인 실패 → 회원가입 시도
    try:
        signup_res = supabase.auth.sign_up(
            {"email": email, "password": password}
        )
    except Exception as e:
        print("[ensure-user] 회원가입 중 오류:", e)
        raise HTTPException(status_code=500, detail=f"회원가입 오류: {str(e)}")

    # supabase-python SDK는 signup 직후 signup_res.user 또는 signup_res.session.user 형태로 반환할 수 있음
    user = None
    if hasattr(signup_res, "user") and signup_res.user:
        user = signup_res.user
    elif hasattr(signup_res, "session") and signup_res.session:
        user = signup_res.session.user

    if user is None:
        print("[ensure-user] signup_res =", signup_res)
        raise HTTPException(status_code=500, detail="'list' object has no attribute 'data' 또는 유저 생성 실패")

    return {"userKey": user.id}
