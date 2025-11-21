// src/notification/notifications.js

const BACKEND_URL = "http://127.0.0.1:8000";
const INCOMPLETE_URL = "http://localhost:3000/incomplete"; 
// 배포하면 https://.../incomplete 로 바꿔

export function getUserKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["userKey"], (r) => resolve(r.userKey || null));
  });
}

// 네 raw_due_text 형식 파서
export function parseDue(raw) {
  if (!raw) return null;

  // 1) HTML 태그 제거
  let text = raw.replace(/<[^>]+>/g, " ").trim();

  // 2) "~" 있는 경우: 기간형 → 오른쪽이 실제 due
  if (text.includes("~")) {
    let parts = text.split("~");
    let endPart = parts[1].trim();

    // (지각 : ...) 제거
    if (endPart.includes("(")) {
      endPart = endPart.split("(")[0].trim();
    }

    return new Date(endPart.replace(" ", "T"));
  }

  // "~" 없는 경우: 단일 날짜
  if (text.includes("(")) {
    text = text.split("(")[0].trim();
  }

  return new Date(text.replace(" ", "T"));
}

function alarmId(itemId, key) {
  return `${itemId}::${key}`;
}

// DB에서 당겨와서 알람 예약
export async function syncAlarms() {
  const userKey = await getUserKey();
  if (!userKey) return;

  const res = await fetch(`${BACKEND_URL}/course_items?user_id=${userKey}`);
  if (!res.ok) return;

  const items = await res.json();
  const now = Date.now();

  for (const it of items) {
    if (!it.is_incomplete) continue;

    const due = parseDue(it.raw_due_text);
    if (!due) continue;

    const rules = [
      { key: "3days", ms: 3 * 24 * 60 * 60 * 1000, enabled: it.notify_3days },
      { key: "1day",  ms: 1 * 24 * 60 * 60 * 1000, enabled: it.notify_1day },
      { key: "6h",    ms: 6 * 60 * 60 * 1000,      enabled: it.notify_6hours },
      { key: "3h",    ms: 3 * 60 * 60 * 1000,      enabled: it.notify_3hours },
    ];

    for (const r of rules) {
      if (!r.enabled) continue;

      const t = due.getTime() - r.ms;
      if (t <= now) continue; // 이미 지난 알림은 패스

      const id = alarmId(it.id, r.key);

      // 알람 예약
      chrome.alarms.create(id, { when: t });

      // 알람 발생 시 쓸 payload 저장
      chrome.storage.local.set({
        [id]: { item: it, key: r.key }
      });
    }
  }
}

// 알람 발생 → 실제 푸시 생성
export async function handleDeadlineAlarm(alarmName) {
  const data = await chrome.storage.local.get(alarmName);
  const payload = data[alarmName];
  if (!payload) return;

  const { item, key } = payload;

  const typeLabel =
    item.item_type?.toLowerCase().includes("assign") ? "과제" :
    item.item_type?.toLowerCase().includes("video") ? "강의" :
    item.item_type?.toLowerCase().includes("quiz") ? "퀴즈" :
    (item.item_type || "할 일");

  const keyLabel =
    key === "3days" ? "3일" :
    key === "1day" ? "1일" :
    key === "6h" ? "6시간" :
    key === "3h" ? "3시간" : key;

  chrome.notifications.create(alarmName, {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "Yalarmy",
    message: `해야 할 ${typeLabel} 마감이 ${keyLabel} 남았습니다!\n${item.item_title}`,
    buttons: [{ title: "미완료 할일 보기" }],
    priority: 2
  });
}

// 알림 클릭/버튼 클릭 시 열 URL
export function openIncompletePage() {
  chrome.tabs.create({ url: INCOMPLETE_URL });
}
