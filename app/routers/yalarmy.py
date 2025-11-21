from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from typing import Optional

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

# app/routers/yalarmy.py

from typing import Optional
from pydantic import BaseModel

# ... (위에 ensure_user와 supabase 클라이언트 세팅은 이미 있다고 가정)

class CourseItemIn(BaseModel):
    user_id: str                      # = supabase user.id (확장 userKey)
    course_title: str
    course_semester: Optional[str] = None
    course_professor: Optional[str] = None
    item_title: str
    item_type: str
    raw_due_text: Optional[str] = None
    has_due: Optional[bool] = None
    is_incomplete: Optional[bool] = None


@router.post("/course_items")
def create_course_item(data: CourseItemIn):
    """
    course_items 테이블에 과제/동영상/퀴즈 등 item 저장
    """
    try:
        payload = {
            "user_id": data.user_id,
            "course_title": data.course_title,
            "course_semester": data.course_semester,
            "course_professor": data.course_professor,
            "item_title": data.item_title,
            "item_type": data.item_type,
            "raw_due_text": data.raw_due_text,
            "has_due": data.has_due,
            "is_incomplete": data.is_incomplete,
        }

        res = supabase.table("course_items").insert(payload).execute()
        return res.data

    except Exception as e:
        print("[create_course_item ERROR]", repr(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/course_items")
def list_course_items(user_id: str):
    """
    특정 user_id의 course_items만 조회
    """
    try:
        res = (
            supabase
            .table("course_items")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=False)
            .execute()
        )
        return res.data
    except Exception as e:
        print("[list_course_items ERROR]", repr(e))
        raise HTTPException(status_code=500, detail=str(e))


# =========================
#  C O U R S E S  (강의)
# =========================

class CourseIn(BaseModel):
    user_id: str
    name: str
    professor: Optional[str] = None
    semester: Optional[str] = None


@router.post("/courses")
def create_course(data: CourseIn):
    """
    특정 user_id의 강의 한 개 저장
    """
    try:
        payload = {
            "user_id": data.user_id,
            "name": data.name,
            "professor": data.professor,
            "semester": data.semester,
        }
        res = supabase.table("courses").insert(payload).execute()
        return res.data

    except Exception as e:
        print("[create_course ERROR]", repr(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/courses")
def list_courses(user_id: str):
    """
    로그인한 user_id의 강의 목록 조회
    """
    try:
        res = (
            supabase
            .table("courses")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=False)
            .execute()
        )
        return res.data

    except Exception as e:
        print("[list_courses ERROR]", repr(e))
        raise HTTPException(status_code=500, detail=str(e))
