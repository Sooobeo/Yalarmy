// popup.js

const BACKEND_URL = "http://127.0.0.1:8000";
const ENSURE_USER_ENDPOINT = "/yalarmy/ensure-user"; 
// ⚠️ 실제 백엔드 경로가 다르면 여기만 바꿔

function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.textContent = msg;
}

// (A) server에 userKey 생성/확인 요청 (필요 없으면 아래 함수 통째로 안 써도 됨)
async function getOrCreateUserKey(loginId, password) {
  const res = await fetch(`${BACKEND_URL}${ENSURE_USER_ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginId, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json(); // { userKey: "..."} 또는 { user_id: "..."} 기대
}

// storage에서 userKey/user_id 둘 다 읽기
function getStoredUserKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["userKey", "user_id"], (r) => {
      resolve(r.userKey || r.user_id || null);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const userKeyInput = document.getElementById("userKey");   // ✅ popup.html id
  const passwordInput = document.getElementById("password"); // ✅ popup.html id
  const saveBtn = document.getElementById("saveBtn");
  const syncBtn = document.getElementById("syncBtn");

  if (!userKeyInput || !passwordInput || !saveBtn || !syncBtn) {
    console.error("[Yalarmy] popup 요소 못 찾음. popup.html id 확인!");
    return;
  }

  // ----------------------------
  // 1) 저장 버튼
  // ----------------------------
  saveBtn.addEventListener("click", async () => {
    try {
      setStatus("저장 중...");

      const loginId = userKeyInput.value.trim();
      const password = passwordInput.value.trim();

      if (!loginId) {
        setStatus("메일/학번(userKey)을 입력해줘.");
        return;
      }

      let userKey = loginId; 
      // ✅ 만약 서버에서 userKey 발급/확인 로직을 쓰고 싶으면 아래 블록 ON
      if (password) {
        try {
          const data = await getOrCreateUserKey(loginId, password);
          userKey = data.userKey || data.user_id || userKey;
        } catch (e) {
          // 서버 안 쓰는 상태면 그냥 loginId 저장하도록 fallback
          console.warn("[Yalarmy] ensure-user 실패, loginId를 userKey로 저장:", e.message);
        }
      }

      chrome.storage.sync.set({ userKey, user_id: userKey }, () => {
        setStatus("저장 완료!");
      });
    } catch (e) {
      console.error(e);
      setStatus(`저장 실패: ${e.message}`);
    }
  });

  // ----------------------------
  // 2) 동기화 버튼
  // ----------------------------
  syncBtn.addEventListener("click", async () => {
    try {
      setStatus("동기화 요청 중...");

      const userKey = await getStoredUserKey();
      if (!userKey) {
        setStatus("먼저 userKey를 저장해줘.");
        return;
      }

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        setStatus("활성 탭이 없어.");
        return;
      }

      // content.js에 파싱/동기화 트리거 메시지 전송
      chrome.tabs.sendMessage(tab.id, { type: "YALARMY_SYNC" }, (res) => {
        if (chrome.runtime.lastError) {
          setStatus("이 페이지에선 동기화 불가(런어스에서 실행해줘).");
          return;
        }
        setStatus(res?.ok ? "동기화 완료!" : "동기화 실패(콘솔 확인)");
      });

    } catch (e) {
      console.error(e);
      setStatus(`동기화 실패: ${e.message}`);
    }
  });
});
