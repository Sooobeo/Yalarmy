function getUserKey() {
  return new Promise((resolve) => {
    // chrome.storage는 예외를 던지지 않음 → try/catch 불필요
    chrome.storage.sync.get(['userKey'], (result) => {
      const key = result && result.userKey ? result.userKey : null;

      console.log('[Yalarmy] getUserKey() →', key);  // 디버깅용 로그

      resolve(key);
    });
  });
}

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

// 1-2) 과목 상세 페이지에서 과제/동강/퀴즈 등 아이템 + 마감일 파싱
function extractItemsFromCourseDoc(doc) {
  // TODO: LearnUs 실제 구조에 맞게 필요하면 셀렉터 한 번 더 튜닝
  // Moodle/런어스 계열에서 활동 하나는 보통 li.activity 같은 구조
  const itemNodes =
    doc.querySelectorAll('li.activity') ||
    doc.querySelectorAll('.activityinstance');

  console.log('[Yalarmy]  이 과목에서 감지된 활동 개수:', itemNodes.length);

  const items = [];

  itemNodes.forEach((node, idx) => {

const completionImg = node.querySelector('img.icon');

let isIncomplete = false;  // 기본값 = 완료로 처리

if (completionImg) {
  const src = completionImg.getAttribute('src') || '';

  if (src.includes('completion-auto-n')) {
    isIncomplete = true;   // 미완료
  } else if (src.includes('completion-auto-y')) {
    isIncomplete = false;  // 완료 (기본값과 동일)
  }
}

// 완료된 활동은 스킵
if (!isIncomplete) return;

    // 타입: 클래스 이름 안에 assignment / quiz / forum / url / resource 등 들어 있는 경우가 많음
    const classList = Array.from(node.classList);
    const typeClass = classList.find((cls) =>
      ['assign', 'quiz', 'forum', 'url', 'resource', 'vod', 'video', 'lecture'].some((key) =>
        cls.toLowerCase().includes(key)
      )
    );
    let itemType = 'unknown';
    if (typeClass) {
      if (typeClass.includes('assign')) itemType = 'assignment';
      else if (typeClass.includes('quiz')) itemType = 'quiz';
      else if (typeClass.includes('forum')) itemType = 'forum';
      else if (typeClass.toLowerCase().includes('vod') || typeClass.toLowerCase().includes('video') || typeClass.toLowerCase().includes('lecture')) {
        itemType = 'video';
      } else {
        itemType = typeClass;
      }
    }

    // 제목: instancename / activityname / a 태그 등에서 추출
    let title = '제목없음';
    let titleEl =
      node.querySelector('.instancename') ||
      node.querySelector('.activityname') ||
      node.querySelector('.activityinstance a') ||
      node.querySelector('a');

    if (titleEl) {
      // instancename 안에 span.accesshide 같은 거 들어 있는 경우 첫 텍스트만 사용
      const firstTextNode = Array.from(titleEl.childNodes).find(
        (n) => n.nodeType === Node.TEXT_NODE
      );
      if (firstTextNode) {
        title = firstTextNode.textContent.trim();
      } else {
        title = titleEl.textContent.trim();
      }
    }

    // 마감일: duedate, submissiondate, 날짜 텍스트 등 추정
    let dueText = null;

    const dueEl =
      node.querySelector('.text-upstrap') ||
      node.querySelector('.submissiondate') ||
      node.querySelector('.submissionsummary') ||
      node.querySelector('.activity-due') ||
      node.querySelector(".text-warning"); // 종종 마감일에 강조 색이 들어감

    if (dueEl) {
      dueText = dueEl.textContent.trim();
    } else {
      // fallback: 노드 전체 텍스트에서 "~"이라는 단어 포함된 줄 찾기
      const lines = node.innerText.split('\n').map((l) => l.trim());
      const maybeDue = lines.find((l) => l.includes('~') || l.toLowerCase().includes('due'));
      if (maybeDue) {
        dueText = maybeDue;
      }
    }

    const item = {
      idx,
      type: itemType,
      title,
      rawDueText: dueText,
      hasDue: !!dueText,   // ✅ 마감이 있으면 true, 없으면 false
      isIncomplete 
    };

    console.log('[Yalarmy]   활동(미완료)', idx + 1, item);
    items.push(item);
  });

  console.log('[Yalarmy]  이 과목에서 "미완료"로 판별된 활동 개수:', items.length);
  return items;
}
// 1-3) 모든 과목에 대해 상세 페이지 fetch + 아이템 붙이기
async function attachCourseItems(courses) {
  const result = [];

  for (const course of courses) {
    if (!course.link) {
      result.push({ ...course, items: [] });
      continue;
    }

    try {
      console.log('[Yalarmy] 과목 상세 페이지 요청:', course.title, course.link);
      const res = await fetch(course.link, { credentials: 'include' });
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const items = extractItemsFromCourseDoc(doc);

      result.push({
        ...course,
        items
      });
    } catch (e) {
      console.error('[Yalarmy] 과목 상세 페이지 파싱 에러:', course.title, e);
      result.push({
        ...course,
        items: []
      });
    }
  }

  console.log('[Yalarmy] 과목 + 아이템 전체 구조:', result);
  return result;
}

// 2) 화면에 "Yalarmy로 동기화" 버튼 주입
function injectSyncButton() {
  const existing = document.getElementById('yalarmy-sync-btn');
  if (existing) return; // 중복 방지

  const btn = document.createElement('button');
  btn.id = 'yalarmy-sync-btn';
  btn.textContent = 'Yalarmy로 동기화';

  btn.style.position = 'fixed';
  // 오른쪽 아래에 LearnUs 버튼이 있으니까, 우리는 왼쪽 아래로 피신
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
    const userKey = await getUserKey();
      if (!userKey) {
        alert('Yalarmy 아이콘을 눌러 메일(user_key)을 먼저 설정해 주세요.');
        return;
      }

      console.log('[Yalarmy] Loaded userKey:', userKey);

    const courses = extractCourses();
    if (courses.length === 0) {
      alert('파싱된 과목이 없습니다.\n페이지 구조나 셀렉터를 다시 확인해 주세요.');
      return;
    }

    btn.disabled = true;
    btn.textContent = '동기화 + 파싱 중...';

    // 1단계: 과목만 Supabase에 동기화
    await syncToSupabaseCourses(courses);

    // 2단계: 각 과목 상세 페이지에서 미완료 아이템 파싱
    const coursesWithItems = await attachCourseItems(courses);

    // 3단계: 미완료 아이템을 Supabase course_items 테이블에 동기화
    await syncCourseItemsToSupabase(coursesWithItems);

    console.log(
      '%c[Yalarmy] 최종 과목 + 과제/동강 마감일 구조:',
      'color: #4f46e5; font-weight: bold;',
      coursesWithItems
    );

    alert('Supabase로 과목 + 미완료 아이템 동기화 완료!');

    btn.textContent = 'Yalarmy로 동기화';
    btn.disabled = false;
  } catch (e) {
    console.error('[Yalarmy] 동기화/파싱 에러:', e);
    alert('동기화/파싱 중 에러가 발생했습니다. (콘솔 확인)');
    btn.disabled = false;
    btn.textContent = 'Yalarmy로 동기화';
  }
});


  document.body.appendChild(btn);
}

// 3) Supabase REST API로 "과목"만 보내는 부분 (기존 기능 유지)
async function syncToSupabaseCourses(courses, userKey) {
  const SUPABASE_URL = 'https://sguedpyifsjqzjhdaqzb.supabase.co';
  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndWVkcHlpZnNqcXpqaGRhcXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzE1NDYsImV4cCI6MjA3NTYwNzU0Nn0.iggfDZwVS9E2MhTIl-9gRDVLZ4ermKCoW43mL-fAl7Q';

  const payload = courses.map((c) => ({
    user_key: userKey,
    name: c.title,
    professor: c.professor,
    semester: c.semester
    // source_link: c.link,
    // user_id: '나의 유저 ID',
  }));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/courses`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[Yalarmy] Supabase 응답 에러:', res.status, text);
    throw new Error(`Supabase Error ${res.status}`);
  }

  console.log('[Yalarmy] Supabase로 과목 동기화 성공');
}

// 3-2) Supabase로 "과목별 미완료 아이템" 보내는 부분
async function syncCourseItemsToSupabase(coursesWithItems, userKey) {
  const SUPABASE_URL = 'https://sguedpyifsjqzjhdaqzb.supabase.co';
  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndWVkcHlpZnNqcXpqaGRhcXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzE1NDYsImV4cCI6MjA3NTYwNzU0Nn0.iggfDZwVS9E2MhTIl-9gRDVLZ4ermKCoW43mL-fAl7Q';

  // coursesWithItems = [{ title, semester, professor, items: [...] }, ...]
  const payload = [];

  coursesWithItems.forEach((course) => {
    const { title: courseTitle, semester, professor, items } = course;
    if (!items || !items.length) return;

    items.forEach((item) => {
      // item.isIncomplete 는 이미 true인 것만 들어있다고 가정
      payload.push({
        user_key: userKey, 
        course_title: courseTitle,
        course_semester: semester,
        course_professor: professor,
        item_title: item.title,
        item_type: item.type,
        raw_due_text: item.rawDueText,
        has_due: item.hasDue,
        is_incomplete: item.isIncomplete
      });
    });
  });

  if (!payload.length) {
    console.log('[Yalarmy] Supabase로 보낼 미완료 아이템이 없습니다.');
    return;
  }

  console.log('[Yalarmy] Supabase로 보낼 미완료 아이템 개수:', payload.length);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/course_items`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[Yalarmy] Supabase course_items 응답 에러:', res.status, text);
    throw new Error(`Supabase course_items Error ${res.status}`);
  }

  console.log('[Yalarmy] Supabase로 미완료 아이템 동기화 성공');
}


// 4) 실제 실행: 과목 리스트 페이지에서만 버튼 주입
window.addEventListener('load', () => {
  if (!isCourseListPage()) {
    console.log('[Yalarmy] 과목 리스트 페이지가 아니라고 판단, 버튼 주입 안 함:', location.href);
    return;
  }
  console.log('[Yalarmy] 과목 리스트 페이지 감지, 버튼 주입');
  injectSyncButton();
});
}

