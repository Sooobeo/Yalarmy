# app/utils/due_parser.py

import re
from datetime import datetime, timedelta, timezone

KST = timezone(timedelta(hours=9))


def parse_due_text(raw: str):
    """
    LearnUs 마감 텍스트(raw_due_text)를 datetime(KST)로 변환
    예:
        "2025-03-15 23:59"
        "2025.03.15 ~ 23:55"
        "2025-03-15(토) 11:00"
    실패하면 None 반환
    """
    if not raw:
        return None

    text = raw.strip()

    # YYYY-MM-DD HH:MM
    m = re.search(r"(\d{4})[-.](\d{1,2})[-.](\d{1,2}).*?(\d{1,2}):(\d{2})", text)
    if m:
        y, mo, d, hh, mm = map(int, m.groups())
        return datetime(y, mo, d, hh, mm, tzinfo=KST)

    # YYYY-MM-DD (날짜만 → 23:59로 보정)
    m = re.search(r"(\d{4})[-.](\d{1,2})[-.](\d{1,2})", text)
    if m:
        y, mo, d = map(int, m.groups())
        return datetime(y, mo, d, 23, 59, tzinfo=KST)

    return None
