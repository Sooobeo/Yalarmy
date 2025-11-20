// popup.js

const userKeyInput = document.getElementById('userKey');
const saveBtn = document.getElementById('saveBtn');
const statusEl = document.getElementById('status');

// 열릴 때 기존 값 불러오기
chrome.storage.sync.get(['userKey'], (result) => {
  if (result.userKey) {
    userKeyInput.value = result.userKey;
    statusEl.textContent = `현재 저장된 user_key: ${result.userKey}`;
  } else {
    statusEl.textContent = '아직 user_key가 설정되지 않았습니다.';
  }
});

// 저장 버튼 클릭 시
saveBtn.addEventListener('click', () => {
  const val = userKeyInput.value.trim();
  if (!val) {
    statusEl.textContent = '이메일을 입력해 주세요.';
    return;
  }

  chrome.storage.sync.set({ userKey: val }, () => {
    statusEl.textContent = `저장 완료: ${val}`;
  });
});
