// background.js (service worker, module)

import { syncAlarms, handleDeadlineAlarm, openIncompletePage } from "./src/notification/notifications.js";

// 확장 설치/업데이트 시 한 번 동기화
chrome.runtime.onInstalled.addListener(async () => {
  await syncAlarms();
});

// 20분마다 재동기화 알람 생성
chrome.alarms.create("yalarmy_sync", { periodInMinutes: 20 });

// 알람 리스너
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "yalarmy_sync") {
    await syncAlarms();
    return;
  }

  // 실제 마감 알람
  await handleDeadlineAlarm(alarm.name);
});

// 알림 클릭 / 버튼 클릭
chrome.notifications.onClicked.addListener(() => {
  openIncompletePage();
});

chrome.notifications.onButtonClicked.addListener(() => {
  openIncompletePage();
});
