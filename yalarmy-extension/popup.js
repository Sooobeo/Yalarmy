const BACKEND_URL = "http://127.0.0.1:8000/"; // 실제 주소로 변경

async function ensureUserKey(email, password) {
  const res = await fetch(`${BACKEND_URL}/yalarmy/ensure-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "유저 생성/로그인 실패");
  }

  const data = await res.json(); // { userKey: "..." }
  const userKey = data.userKey;

  await chrome.storage.sync.set({ userKey, email });
  return userKey;
}

// 기존에 userKey를 가져오는 함수는 그대로 두되,
// 없을 때만 위 ensureUserKey를 타도록 만들면 됨.
function getUserKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["userKey"], async (r) => {
      if (r.userKey) {
        resolve(r.userKey);
      } else {
        // 여기서 UI에서 입력받은 email/password를 넘겨주면 됨
        // 예시용: 전역 변수나 input에서 읽어오기
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value.trim();

        try {
          const newKey = await ensureUserKey(email, password);
          resolve(newKey);
        } catch (e) {
          console.error("[Yalarmy] userKey 생성 실패:", e);
          resolve(null);
        }
      }
    });
  });
}


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

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
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
