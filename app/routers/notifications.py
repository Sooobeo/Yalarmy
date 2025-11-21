from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.notifications import SyncRequest, NotificationOut
from app.utils.notify_rules import compute_notify_times
from app.db import supabase
from datetime import datetime, timedelta, timezone

KST = timezone(timedelta(hours=9))

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


# ===============================================================
# 3단계 A) SYNC — multi-notify + upsert + 유령알림(canceled) 처리
# ===============================================================
@router.post("/sync")
def sync_notifications(req: SyncRequest):
    """
    파싱된 포털 items를 받아
    - multi-notify 규칙에 따라 multiple notify_at 생성
    - 기존 알림 중 살아남지 못한 것(canceled)
    - 중복 방지 업서트
    """
    created = 0

    # 이번 sync에서 살아남아야 할 key set 생성
    alive_keys = set()
    for item in req.items:
        notify_times = compute_notify_times(item.due_at)
        for nt in notify_times:
            alive_keys.add((
                req.user_id,
                item.title,
                item.due_at.isoformat(),
                nt.isoformat()
            ))

    # 1) 기존 알림 중 이번 sync에 포함되지 않은 것 = canceled 처리
    existing = (
        supabase.table("notifications")
        .select("id, user_id, title, due_at, notify_at, sent, canceled")
        .eq("user_id", req.user_id)
        .eq("sent", False)
        .eq("canceled", False)
        .execute()
    ).data or []

    to_cancel = []
    for row in existing:
        key = (
            row["user_id"],
            row["title"],
            row["due_at"],
            row["notify_at"]
        )
        if key not in alive_keys:
            to_cancel.append(row["id"])

    if to_cancel:
        supabase.table("notifications") \
            .update({"canceled": True}) \
            .in_("id", to_cancel) \
            .execute()

    # 2) 새 알림 업서트
    for item in req.items:
        notify_times = compute_notify_times(item.due_at)

        for notify_at in notify_times:
            payload = {
                "user_id": req.user_id,
                "title": item.title,
                "body": item.body,
                "target_url": str(item.target_url) if item.target_url else None,
                "due_at": item.due_at.isoformat(),
                "notify_at": notify_at.isoformat(),
                "sent": False,
                "canceled": False,
                "updated_at": datetime.now(KST).isoformat()
            }

            res = supabase.table("notifications").upsert(
                payload,
                on_conflict="user_id,title,due_at,notify_at"
            ).execute()

            if res.data:
                created += 1

    return {"ok": True, "created_or_updated": created}



# ===============================================================
# 3단계 B) DUE — polling 간격 고려 (window), canceled 제외
# ===============================================================
@router.get("/due", response_model=List[NotificationOut])
def list_due_notifications(
    user_id: str,
    window_minutes: int = 5,
    limit: int = 50
):
    """
    확장이 호출:
    sent=False, canceled=False AND notify_at <= now + window 의 알림 반환.
    """
    now = datetime.now(KST)
    window_end = now + timedelta(minutes=window_minutes)

    res = (
        supabase.table("notifications")
        .select("*")
        .eq("user_id", user_id)
        .eq("sent", False)
        .eq("canceled", False)
        .lte("notify_at", window_end.isoformat())
        .order("notify_at", desc=False)
        .limit(limit)
        .execute()
    )
    return res.data or []



# ===============================================================
# 3단계 C) 알림을 띄운 뒤 sent=true 처리 → 중복 방지
# ===============================================================
@router.patch("/{notification_id}/mark-sent")
def mark_sent(notification_id: str):
    res = (
        supabase.table("notifications")
        .update({
            "sent": True,
            "last_sent_at": datetime.now(KST).isoformat()
        })
        .eq("id", notification_id)
        .execute()
    )

    if not res.data:
        raise HTTPException(404, "notification not found")

    return {"ok": True}
