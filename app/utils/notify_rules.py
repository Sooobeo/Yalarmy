from datetime import datetime, timedelta
from typing import List

# 너희 multi-notify 규칙을 여기서 고정
DEFAULT_OFFSETS = [
    timedelta(days=1),      # 24시간 전
    timedelta(hours=3),     # 3시간 전
    timedelta(minutes=30),  # 30분 전
]

def compute_notify_times(due_at: datetime, offsets=DEFAULT_OFFSETS) -> List[datetime]:
    times = []
    for off in offsets:
        t = due_at - off
        # 이미 지난 시각이면 스킵 (필요하면 정책 바꿔도 됨)
        if t > datetime.now(t.tzinfo):
            times.append(t)
    # 중복 제거 + 정렬
    times = sorted(list(set(times)))
    return times
