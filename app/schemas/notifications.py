# app/schemas/notifications.py
from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional, List
from app.routers.due_parser import parse_due_text


# 1) 확장에서 오는 하나의 포털 아이템
class PortalItem(BaseModel):
    title: str
    body: Optional[str] = None
    target_url: Optional[HttpUrl] = None

    # raw_due_text만 넘어와도 due_at을 계산할 수 있게 함
    raw_due_text: Optional[str] = None
    due_at: Optional[datetime] = None  # content script가 직접 넣어도 되고, 백엔드에서 parse해도 됨


# 2) sync 요청 전체
class SyncRequest(BaseModel):
    user_id: str            # userKey (supabase user.id와 동일하게 사용)
    items: List[PortalItem]


# 3) /due 응답으로 확장에 내려주는 구조
class NotificationOut(BaseModel):
    id: str
    user_id: str
    title: str
    body: Optional[str] = None
    target_url: Optional[str] = None
    raw_due_text: Optional[str] = None

    due_at: str            # ISO8601 문자열
    notify_at: str         # ISO8601 문자열

    sent: bool
    canceled: bool

    updated_at: Optional[str] = None
    last_sent_at: Optional[str] = None
