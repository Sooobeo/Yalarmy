# app/routers/course_items.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db import supabase

router = APIRouter(prefix="/api/course-items", tags=["course_items"])


class CourseItemIn(BaseModel):
    user_id: str
    course_title: str
    course_semester: Optional[str] = None
    course_professor: Optional[str] = None
    item_title: str
    item_type: str
    raw_due_text: Optional[str] = None
    has_due: bool
    is_incomplete: bool


@router.post("/")
def create_course_item(data: CourseItemIn):
    """
    LearnUs에서 파싱한 '미완료 과제/동강/퀴즈'를 저장
    알림은 notifications.sync가 담당하므로 여기선 저장만 함.
    """

    payload = data.model_dump()

    res = (
        supabase.table("course_items")
        .insert(payload)
        .execute()
    )

    if not res.data:
        raise HTTPException(500, "Failed to insert course item")

    return {"ok": True, "inserted": res.data}
