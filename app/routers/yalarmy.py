# yalarmy.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import supabase

router = APIRouter(prefix="/yalarmy", tags=["yalarmy"])

class EnsureUserRequest(BaseModel):
    email: str
    password: str

@router.post("/ensure-user")
def ensure_user(body: EnsureUserRequest):
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

    # ✅ supabase v2 호환: res.data.user 우선 확인
    user = None
    if getattr(res, "user", None):
        user = res.user
    elif getattr(res, "data", None) and getattr(res.data, "user", None):
        user = res.data.user
    elif getattr(res, "data", None) and getattr(res.data, "session", None):
        user = res.data.session.user

    if user is not None:
        return {"userKey": user.id}

    # 2) 로그인 실패 → 회원가입
    try:
        signup_res = supabase.auth.sign_up(
            {"email": email, "password": password}
        )
    except Exception as e:
        print("[ensure-user] 회원가입 중 오류:", e)
        raise HTTPException(status_code=500, detail=f"회원가입 오류: {str(e)}")

    signup_user = None
    if getattr(signup_res, "user", None):
        signup_user = signup_res.user
    elif getattr(signup_res, "data", None) and getattr(signup_res.data, "user", None):
        signup_user = signup_res.data.user
    elif getattr(signup_res, "data", None) and getattr(signup_res.data, "session", None):
        signup_user = signup_res.data.session.user

    if signup_user is None:
        print("[ensure-user] signup_res =", signup_res)
        raise HTTPException(status_code=500, detail="유저 생성 실패")

    return {"userKey": signup_user.id}
