// popup.js

const BACKEND_URL = "http://127.0.0.1:8000"; 
// 배포 시 백엔드 도메인으로 바꿔

// ✅ 실제 존재하는 엔드포인트로 바꿔야 함!
// 지금 에러난 경로가 /yalarmy/ensure-user 였으니까
// 네 백엔드에 맞게 여기만 정확히 수정하면 됨.
const ENSURE_USER_ENDPOINT = "/yalarmy/ensure-user"; 
// 예: "/api/users/ensure" 같은 걸로 바뀌었으면 그걸로

async function getOrCreateUserKey(loginId, password) {
  const res = await fetch(`${BACKEND_URL}${ENSURE_USER_ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loginId, password })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json(); // { userKey: "..."} 같은 응답이라고 가정
}

document.addEventListener("DOMContentLoaded", () => {
  const userIdInput = document.getElementById("userIdInput");
  const passwordInput = document.getElementById("passwordInput");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");

  if (!saveBtn) {
    console.error("[Yalarmy] saveBtn 없음. popup.html id 확인!");
    return;
  }

  saveBtn.addEventListener("click", async () => {
    try {
      status.textContent = "저장 중...";
      const loginId = userIdInput.value.trim();
      const password = passwordInput.value.trim();

      if (!loginId || !password) {
        status.textContent = "아이디/비번을 입력해줘.";
        return;
      }

      // 서버에서 userKey 생성/확인
      const data = await getOrCreateUserKey(loginId, password);
      const userKey = data.userKey || data.user_id;

      if (!userKey) {
        status.textContent = "서버 응답에 userKey가 없어.";
        return;
      }

      // ✅ storage에 저장 (userKey + user_id 둘 다 넣어두면 완전 안전)
      chrome.storage.sync.set({ userKey, user_id: userKey }, () => {
        status.textContent = "저장 완료! 이제 동기화 누르면 돼.";
      });

    } catch (e) {
      console.error(e);
      status.textContent = `저장 실패: ${e.message}`;
    }
  });
});
