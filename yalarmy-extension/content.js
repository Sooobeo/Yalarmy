// content.js  (LearnUs course list page)

// ============================
// 0) userKey 읽기 (기존 값 유지)
// ============================
function getUserKey() {
  return new Promise((resolve) => {
    // user_id도 같이 지원(브릿지)
    chrome.storage.sync.get(["userKey", "user_id"], (result) => {
      const key = result?.userKey ?? result?.user_id ?? null;
      console.log("[Yalarmy] getUserKey() →", key);
      resolve(key);
    });
  });
}

// ============================
// 1) 이 페이지가 과목 리스트인지 체크
// ============================
function isCourseListPage() {
  return document.querySelector("li.course-label-r") !== null;
}

// ============================
// 2) 과목 리스트 파싱
// ============================
function extractCourses() {
  const courseNodes = document.querySelectorAll(".course-box");
  console.log("[Yalarmy] 감지된 과목 컨테이너 개수:", courseNodes.length);

  const courses = Array.from(courseNodes).map((node, idx) => {
    const linkEl = node.querySelector("a.course-link");
    const link = linkEl ? linkEl.href : null;

    const h3El = node.querySelector(".course-title h3");
    let title = "제목없음";
    if (h3El) {
      const firstTextNode = Array.from(h3El.childNodes).find(
        (n) => n.nodeType === Node.TEXT_NODE
      );
      title = firstTextNode
        ? firstTextNode.textContent.trim()
        : h3El.innerText.trim();
    }

    const semesterEl = node.querySelector(".course-title .semester-name");
    const semester = semesterEl ? semesterEl.innerText.trim() : null;

    const profEl = node.querySelector(".course-title .prof");
    const professor = profEl ? profEl.innerText.trim() : null;

    const course = { title, link, semester, professor };
    console.log(`[Yalarmy] 과목 ${idx + 1}:`, course);
    return course;
  });

  console.log("[Yalarmy] 최종 파싱된 과목들:", courses);
  return courses;
}

// ============================
// 3) 과목 상세 페이지에서 "미완료 아이템" 파싱
// ============================
function extractItemsFromCourseDoc(doc) {
  const itemNodes =
    doc.querySelectorAll("li.activity") ||
    doc.querySelectorAll(".activityinstance");

  console.log("[Yalarmy]  이 과목에서 감지된 활동 개수:", itemNodes.length);

  const items = [];

  itemNodes.forEach((node, idx) => {
    // 완료/미완료 판정
    const completionImg = node.querySelector("img.icon");
    let isIncomplete = false;
    if (completionImg) {
      const src = completionImg.getAttribute("src") || "";
      if (src.includes("completion-auto-n")) isIncomplete = true;
      if (src.includes("completion-auto-y")) isIncomplete = false;
    }
    if (!isIncomplete) return; // ✅ 완료된 건 스킵

    // 타입 추정
    const classList = Array.from(node.classList);
    const typeClass = classList.find((cls) =>
      ["assign", "quiz", "forum", "url", "resource", "vod", "video", "lecture"].some((key) =>
        cls.toLowerCase().includes(key)
      )
    );

    let itemType = "unknown";
    if (typeClass) {
      if (typeClass.includes("assign")) itemType = "assignment";
      else if (typeClass.includes("quiz")) itemType = "quiz";
      else if (typeClass.includes("forum")) itemType = "forum";
      else if (
        typeClass.toLowerCase().includes("vod") ||
        typeClass.toLowerCase().includes("video") ||
        typeClass.toLowerCase().includes("lecture")
      ) itemType = "video";
      else itemType = typeClass;
    }

    // 제목
    let title = "제목없음";
    const titleEl =
      node.querySelector(".instancename") ||
      node.querySelector(".activityname") ||
      node.querySelector(".activityinstance a") ||
      node.querySelector("a");

    if (titleEl) {
      const firstTextNode = Array.from(titleEl.childNodes).find(
        (n) => n.nodeType === Node.TEXT_NODE
      );
      title = firstTextNode
        ? firstTextNode.textContent.trim()
        : titleEl.textContent.trim();
    }

    // 마감 텍스트
    let dueText = null;
    const dueEl =
      node.querySelector(".text-upstrap") ||
      node.querySelector(".submissiondate") ||
      node.querySelector(".submissionsummary") ||
      node.querySelector(".activity-due") ||
      node.querySelector(".text-warning");

    if (dueEl) {
      dueText = dueEl.textContent.trim();
    } else {
      const lines = node.innerText.split("\n").map((l) => l.trim());
      const maybeDue = lines.find((l) => l.includes("~") || l.toLowerCase().includes("due"));
      if (maybeDue) dueText = maybeDue;
    }

    const item = {
      idx,
      type: itemType,
      title,
      rawDueText: dueText,
      hasDue: !!dueText,
      isIncomplete
    };

    console.log("[Yalarmy]   활동(미완료)", idx + 1, item);
    items.push(item);
  });

  console.log("[Yalarmy]  이 과목에서 '미완료' 활동 개수:", items.length);
  return items;
}

async function attachCourseItems(courses) {
  const result = [];
  for (const course of courses) {
    if (!course.link) {
      result.push({ ...course, items: [] });
      continue;
    }

    try {
      console.log("[Yalarmy] 과목 상세 페이지 요청:", course.title, course.link);
      const res = await fetch(course.link, { credentials: "include" });
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      const items = extractItemsFromCourseDoc(doc);
      result.push({ ...course, items });
    } catch (e) {
      console.error("[Yalarmy] 과목 상세 페이지 파싱 에러:", course.title, e);
      result.push({ ...course, items: [] });
    }
  }

  console.log("[Yalarmy] 과목 + 아이템 전체 구조:", result);
  return result;
}

// ============================
// 4) 동기화 버튼 주입
// ============================
function injectSyncButton() {
  const existing = document.getElementById("yalarmy-sync-btn");
  if (existing) return;

  const btn = document.createElement("button");
  btn.id = "yalarmy-sync-btn";
  btn.textContent = "Yalarmy로 동기화";

  btn.style.position = "fixed";
  btn.style.left = "20px";
  btn.style.bottom = "20px";
  btn.style.zIndex = "9999";
  btn.style.padding = "10px 16px";
  btn.style.borderRadius = "999px";
  btn.style.border = "none";
  btn.style.background = "#4f46e5";
  btn.style.color = "white";
  btn.style.fontSize = "14px";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

  btn.addEventListener("click", async () => {
    try {
      const userKey = await getUserKey();
      if (!userKey) {
        alert("Yalarmy 아이콘을 눌러 userKey(user_id)를 먼저 설정해 주세요.");
        return;
      }

      const courses = extractCourses();
      if (courses.length === 0) {
        alert("파싱된 과목이 없습니다.");
        return;
      }

      btn.disabled = true;
      btn.textContent = "동기화 + 파싱 중...";

      // ✅ 과목 상세 미완료 아이템까지 파싱
      const coursesWithItems = await attachCourseItems(courses);

      // ✅ TODO: 너희가 지금 쓰는 동기화 방식에 맞춰 여기만 바꾸면 됨.
      // (1) 기존 방식 유지: Supabase REST로 courses / course_items 테이블에 넣기
      await syncToSupabaseCourses(courses, userKey);
      await syncCourseItemsToSupabase(coursesWithItems, userKey);

      alert("Supabase로 과목 + 미완료 아이템 동기화 완료!");

    } catch (e) {
      console.error("[Yalarmy] 동기화/파싱 에러:", e);
      alert("동기화/파싱 중 에러 발생 (콘솔 확인)");
    } finally {
      btn.disabled = false;
      btn.textContent = "Yalarmy로 동기화";
    }
  });

  document.body.appendChild(btn);
}

// ============================
// 5) Supabase REST 동기화(기존 코드) — userKey 인자 제대로 받게 수정
// ============================
async function syncToSupabaseCourses(courses, userKey) {
  const SUPABASE_URL = "https://sguedpyifsjqzjhdaqzb.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndWVkcHlpZnNqcXpqaGRhcXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzE1NDYsImV4cCI6MjA3NTYwNzU0Nn0.iggfDZwVS9E2MhTIl-9gRDVLZ4ermKCoW43mL-fAl7Q";

  const payload = courses.map((c) => ({
    user_key: userKey,
    name: c.title,
    professor: c.professor,
    semester: c.semester
  }));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/courses`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[Yalarmy] Supabase courses 응답 에러:", res.status, text);
    throw new Error(`Supabase courses Error ${res.status}`);
  }
  console.log("[Yalarmy] Supabase로 과목 동기화 성공");
}

async function syncCourseItemsToSupabase(coursesWithItems, userKey) {
  const SUPABASE_URL = "https://sguedpyifsjqzjhdaqzb.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndWVkcHlpZnNqcXpqaGRhcXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzE1NDYsImV4cCI6MjA3NTYwNzU0Nn0.iggfDZwVS9E2MhTIl-9gRDVLZ4ermKCoW43mL-fAl7Q";

  const payload = [];

  coursesWithItems.forEach((course) => {
    const { title: courseTitle, semester, professor, items } = course;
    if (!items || !items.length) return;

    items.forEach((item) => {
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
    console.log("[Yalarmy] Supabase로 보낼 미완료 아이템이 없습니다.");
    return;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/course_items`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[Yalarmy] Supabase course_items 응답 에러:", res.status, text);
    throw new Error(`Supabase course_items Error ${res.status}`);
  }

  console.log("[Yalarmy] Supabase로 미완료 아이템 동기화 성공");
}

// ============================
// 6) 실제 실행
// ============================
window.addEventListener("load", () => {
  if (!isCourseListPage()) {
    console.log("[Yalarmy] 과목 리스트 페이지 아님 → 버튼 미주입:", location.href);
    return;
  }
  console.log("[Yalarmy] 과목 리스트 페이지 감지 → 버튼 주입");
  injectSyncButton();
});
