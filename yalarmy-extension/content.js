// Yalarmy LearnUs Sync content script
// ------------------------------------------------------
// ✅ 로그인은 사용자가 직접 브라우저에서 한다.
// ✅ 이 스크립트는 "로그인된 페이지"의 DOM만 읽는다.
// ------------------------------------------------------

// 0) 이 페이지에서 작동할지 간단하게 체크
//    - URL 패턴은 LearnUs "내 강의 목록"에 맞게 바꿔도 됨.
// 🔁 수정: 이제 /my/ 페이지에서만 동작
function isCourseListPage() {
  // li.course-label-r 이 하나라도 있으면 "과목 리스트 화면"이라고 판단
  return document.querySelector('li.course-label-r') !== null;
}

{
function extractCourses() {
  // 내 강의 목록 화면에서 과목 카드 하나를 감싸는 최상위 컨테이너
  const courseNodes = document.querySelectorAll('.course-box');

  console.log('[Yalarmy] 감지된 과목 컨테이너 개수:', courseNodes.length);

  const courses = Array.from(courseNodes).map((node, idx) => {
    // 1) 과목 링크 (<a class="course-link">)
    const linkEl = node.querySelector('a.course-link');
    const link = linkEl ? linkEl.href : null;

    // 2) 과목명: .course-title 안의 <h3>의 "첫 번째 텍스트 노드"만
    const h3El = node.querySelector('.course-title h3');

    let title = '제목없음';
    if (h3El) {
      const firstTextNode = Array.from(h3El.childNodes).find(
        (n) => n.nodeType === Node.TEXT_NODE
      );
      if (firstTextNode) {
        title = firstTextNode.textContent.trim();  // 예: "거시경제학 (ECO2101.03-00)"
      } else {
        title = h3El.innerText.trim();
      }
    }

    // 3) 학기: <span class="semester-name">(2학기)</span>
    const semesterEl = node.querySelector('.course-title .semester-name');
    const semester = semesterEl ? semesterEl.innerText.trim() : null;

    // 4) 교수/분반: <span class="prof">ECO2101.03-00 / 최상엽</span>
    const profEl = node.querySelector('.course-title .prof');
    const professor = profEl ? profEl.innerText.trim() : null;

    const course = {
      title,
      link,
      semester,
      professor
    };

    console.log(`[Yalarmy] 과목 ${idx + 1}:`, course);
    return course;
  });

  console.log('[Yalarmy] 최종 파싱된 과목들:', courses);
  return courses;
}


  // 2) 화면에 "Yalarmy로 동기화" 버튼 주입
  function injectSyncButton() {
  const existing = document.getElementById('yalarmy-sync-btn');
  if (existing) return;

  const btn = document.createElement('button');
  btn.id = 'yalarmy-sync-btn';
  btn.textContent = 'Yalarmy로 동기화';

  btn.style.position = 'fixed';
  // 🔁 오른쪽 아래 → 왼쪽 아래로 변경
  btn.style.left = '20px';
  btn.style.bottom = '20px';
  btn.style.right = 'auto';

  btn.style.zIndex = '9999';
  btn.style.padding = '10px 16px';
  btn.style.borderRadius = '999px';
  btn.style.border = 'none';
  btn.style.background = '#4f46e5';
  btn.style.color = 'white';
  btn.style.fontSize = '14px';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';

    btn.addEventListener('click', async () => {
      try {
        const courses = extractCourses();
        if (courses.length === 0) {
          alert('파싱된 과목이 없습니다.\n페이지 구조나 셀렉터를 다시 확인해 주세요.');
          return;
        }

        btn.disabled = true;
        btn.textContent = '동기화 중...';

        await syncToSupabase(courses);

        btn.textContent = '동기화 완료!';
        setTimeout(() => {
          btn.textContent = 'Yalarmy로 동기화';
          btn.disabled = false;
        }, 1500);
      } catch (e) {
        console.error('[Yalarmy] 동기화 에러:', e);
        alert('동기화 중 에러가 발생했습니다. (콘솔 확인)');
        btn.disabled = false;
        btn.textContent = 'Yalarmy로 동기화';
      }
    });

    document.body.appendChild(btn);
  }

  // 3) Supabase REST API로 보내는 부분 (개인용 버전)
  async function syncToSupabase(courses) {
    const SUPABASE_URL = 'https://sguedpyifsjqzjhdaqzb.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndWVkcHlpZnNqcXpqaGRhcXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzE1NDYsImV4cCI6MjA3NTYwNzU0Nn0.iggfDZwVS9E2MhTIl-9gRDVLZ4ermKCoW43mL-fAl7Q';

    const payload = courses.map((c) => ({
      name: c.title,
      professor: c.professor,
      semester: c.semester,
      // source_link: c.link,
      // user_id: '나의 유저 ID',
    }));

    const res = await fetch(`${SUPABASE_URL}/rest/v1/courses`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[Yalarmy] Supabase 응답 에러:', res.status, text);
      throw new Error(`Supabase Error ${res.status}`);
    }

    console.log('[Yalarmy] Supabase 동기화 성공');
  }

  // 4) 실제 실행
  window.addEventListener('load', () => {
  if (!isCourseListPage()) {
    console.log('[Yalarmy] 과목 리스트 페이지가 아니라고 판단, 버튼 주입 안 함:', location.href);
    return;
  }
  console.log('[Yalarmy] 과목 리스트 페이지 감지, 버튼 주입');
  injectSyncButton();
});
}
