// popup.js (정리본)

const BACKEND_URL = "http://127.0.0.1:8000"; // ✅ 마지막 / 제거

async function getOrCreateUserKey(email, password) {
  // 1) 이미 저장된 userKey가 있으면 그대로 사용
  const stored = await chrome.storage.sync.get(["userKey"]);
  if (stored.userKey) return stored.userKey;

  // 2) 없으면 backend로 요청
  const res = await fetch(`${BACKEND_URL}/yalarmy/ensure-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "ensure-user 실패");
  }

  const data = await res.json(); // { userKey: "supabase-user-id" }
  const userKey = data.userKey;

  // 3) 저장
  await chrome.storage.sync.set({ userKey, email });

  return userKey;
}

document.getElementById("saveBtn").addEventListener("click", async () => {
  // ✅ popup.html id에 맞춤
  const email = document.getElementById("userKey").value.trim();
  const password = document.getElementById("password").value.trim();
  const statusEl = document.getElementById("status");

  try {
    statusEl.textContent = "연동 중...";
    const userKey = await getOrCreateUserKey(email, password);
    statusEl.textContent = "연동 완료! userKey = " + userKey;
    console.log("[Yalarmy] linked userKey:", userKey);
  } catch (e) {
    statusEl.textContent = "실패: " + e.message;
    console.error(e);
  }
});

document.getElementById("syncBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "동기화 중...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    status.textContent = "활성 탭 없음";
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: "YALARMY_SYNC" }, (res) => {
    if (chrome.runtime.lastError) {
      status.textContent = "이 페이지는 동기화 불가";
      return;
    }
    status.textContent = res?.ok ? "동기화 완료!" : "동기화 실패";
  });
});
