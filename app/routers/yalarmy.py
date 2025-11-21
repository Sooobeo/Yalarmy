from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

class EnsureUserReq(BaseModel):
    email: EmailStr
    password: str

@router.post("/yalarmy/ensure-user")
def ensure_user(req: EnsureUserReq):
    email = req.email
    password = req.password

    try:
        # 1) 이메일로 유저 찾기 (지원되는 버전이면 제일 깔끔)
        user = supabase.auth.admin.get_user_by_email(email)
        if user:
            # user가 dict/obj 둘 다 가능하니 안전 처리
            user_id = user["id"] if isinstance(user, dict) else user.user.id
            return {"userKey": user_id}

    except Exception:
        # get_user_by_email이 없는 버전이면 여기로 빠져서 아래 create로 감
        pass

    # 2) 없으면 생성
    create_res = supabase.auth.admin.create_user({
        "email": email,
        "password": password,
        "email_confirm": True,
    })
    new_user = getattr(create_res, "user", None) or getattr(create_res, "data", {}).get("user")
    if not new_user:
        raise HTTPException(status_code=500, detail=f"유저 생성 실패: {create_res}")

    new_id = new_user["id"] if isinstance(new_user, dict) else new_user.id
    return {"userKey": new_id}

