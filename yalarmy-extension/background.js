// background.js (Manifest V3 service worker)

// =========================
// 설정값
// =========================
const API_BASE = "http://127.0.0.1:8000"; // 배포 시 https://api.xxx 로 바꾸기
const POLL_MINUTES = 10;                 // 미완료 알림 pull 주기
const WINDOW_MINUTES = 5;               // due window (백엔드 due와 동일)
const INCOMPLETE_URL = "http://localhost:3000/incomplete"; 
// 배포 URL 예: "https://yalarmy.vercel.app/incomplete"

// 알람 prefix
const POLL_ALARM_NAME = "yalarmy_poll_due";

// =========================
// util
// =========================

// chrome.storage에서 user_id/userKey 둘 다 지원
function getUserId() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["user_id", "userKey"], (r) => {
      resolve(r.user_id || r.userKey || null);
    });
  });
}

// due 알림 fetch
async function fetchDueNotifications(userId) {
  const url = new URL(`${API_BASE}/api/notifications/due`);
  url.searchParams.set("user_id", userId);
  url.searchParams.set("window_minutes", String(WINDOW_MINUTES));
  url.searchParams.set("limit", "50");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // [{id,title,body,due_at,notify_at,target_url,...}]
}

// mark-sent 호출
async function markSent(notificationId) {
  const res = await fetch(
    `${API_BASE}/api/notifications/${notificationId}/mark-sent`,
    { method: "PATCH" }
  );
  if (!res.ok) throw new Error(await res.text());
}

// 알림 텍스트 만들기(필요하면 item_type 넣어서 바꾸기)
function buildNotificationMessage(noti) {
  // title을 그대로 쓰거나, body가 있으면 합쳐도 됨
  // "해야 할 {과제/퀴즈/강의} 마감이 {n일/n시간} 남았습니다!"
  // 여기선 notify_at 기준으로 남은 시간 계산해서 메시지 생성
  const due = new Date(noti.due_at);
  const now = new Date();
  const diffMs = due - now;

  const diffHours = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
  const diffDays = Math.floor(diffHours / 24);
  const remainHours = diffHours % 24;

  let remainText = "";
  if (diffDays > 0) remainText = `${diffDays}일`;
  else remainText = `${remainHours}시간`;

  return `해야 할 마감이 ${remainText} 남았습니다!`;
}

// OS notification 띄우기
function showOSNotification(noti) {
  const notificationId = `yalarmy::${noti.id}`;

  chrome.notifications.create(notificationId, {
    type: "basic",
    iconUrl: "icons/icon128.png",   // 네 확장 아이콘 경로에 맞춰
    title: noti.title || "Yalarmy 알림",
    message: buildNotificationMessage(noti),
    buttons: [{ title: "미완료 할일 보기" }],
    priority: 2
  });
}

// =========================
// 핵심: pull → notify → mark-sent
// =========================
async function pollAndNotify() {
  try {
    const userId = await getUserId();
    if (!userId) {
      console.log("[Yalarmy] user_id 없음 → poll 스킵");
      return;
    }

    const dueList = await fetchDueNotifications(userId);
    if (!Array.isArray(dueList) || dueList.length === 0) {
      console.log("[Yalarmy] due 없음");
      return;
    }

    console.log(`[Yalarmy] due ${dueList.length}개 발견`);

    // 발견된 알림들 OS notify + mark-sent
    for (const noti of dueList) {
      showOSNotification(noti);
      // 여기서 바로 sent 처리(중복 방지)
      // 네 정책상 "알림 띄우면 sent"가 맞으니까 즉시 처리
      await markSent(noti.id);
    }
  } catch (e) {
    console.error("[Yalarmy] pollAndNotify 에러:", e);
  }
}

// =========================
// 폴링 알람 등록
// =========================
function ensurePollingAlarm() {
  chrome.alarms.get(POLL_ALARM_NAME, (alarm) => {
    if (!alarm) {
      chrome.alarms.create(POLL_ALARM_NAME, {
        periodInMinutes: POLL_MINUTES
      });
      console.log("[Yalarmy] polling alarm created");
    }
  });
}

// 설치/업데이트 시 알람 세팅
chrome.runtime.onInstalled.addListener(() => {
  ensurePollingAlarm();
  pollAndNotify(); // 설치 직후 1번 바로 체크
});

// 브라우저 켜질 때도 알람 보장
chrome.runtime.onStartup.addListener(() => {
  ensurePollingAlarm();
});

// 알람 발생 → poll
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === POLL_ALARM_NAME) {
    pollAndNotify();
  }
});

// =========================
// 알림 클릭/버튼 클릭 시 이동
// =========================
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith("yalarmy::")) {
    chrome.tabs.create({ url: INCOMPLETE_URL });
  }
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (notificationId.startsWith("yalarmy::") && buttonIndex === 0) {
    chrome.tabs.create({ url: INCOMPLETE_URL });
  }
});
