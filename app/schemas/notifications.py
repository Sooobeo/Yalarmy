from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional, List

class PortalItem(BaseModel):
    # 포털에서 긁어온 단일 과제/강의 일정
    title: str                      # 예: "[과제] 3주차 퀴즈"
    body: Optional[str] = None      # 예: "제출 마감"
    target_url: Optional[HttpUrl] = None
    due_at: datetime                # 마감시간 (KST로 normalize해서 보내거나, 백엔드에서 KST 처리)

class SyncRequest(BaseModel):
    user_id: str                    # 통합된 userKey/uid
    items: List[PortalItem]

class NotificationOut(BaseModel):
    id: str
    user_id: str
    title: str
    body: Optional[str]
    target_url: Optional[str]
    due_at: datetime
    notify_at: datetime
    sent: bool
