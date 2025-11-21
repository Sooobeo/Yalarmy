import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineClipboard } from "react-icons/hi";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = "http://127.0.0.1:8000";

/**
 * 이 컴포넌트는 supabaseClient가 없어도 죽지 않게 만들었음.
 * 우선순위:
 * 1) supabaseClient 있으면 user.id 사용
 * 2) 없으면 localStorage.userKey 사용
 * 3) 둘 다 없으면 안내 메시지
 */

function Unfinished() {
  const [selected, setSelected] = useState("전체");
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState(["전체"]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState("mounted ✅");
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("[Unfinished] mounted");
    setDebug("useEffect ran ✅");

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // ----------------------------
        // 1) user id 얻기
        // ----------------------------
        let userId = null;

        // (A) supabaseClient가 있다면 동적 import로 가져오기
        try {
          const mod = await import("../lib/supabaseClient"); // 경로 있으면 성공
          const supabase = mod.supabase;

          const { data: userRes } = await supabase.auth.getUser();
          userId = userRes?.user?.id || null;
          console.log("[Unfinished] supabase userId =", userId);
        } catch (e) {
          console.warn("[Unfinished] supabaseClient 없음 → localStorage fallback");
        }

        // (B) fallback: localStorage에서 userKey 읽기
        if (!userId) {
          userId = localStorage.getItem("userKey");
          console.log("[Unfinished] localStorage userKey =", userId);
        }

        if (!userId) {
          setItems([]);
          setCourses(["전체"]);
          setLoading(false);
          setDebug("userId 없음 ❌ (로그인/연동 필요)");
          return;
        }

        // ----------------------------
        // 2) 백엔드 fetch
        // ----------------------------
        const url = `${BACKEND_URL}/course_items?user_id=${userId}`;
        console.log("[Unfinished] fetching:", url);

        const res = await fetch(url);
        console.log("[Unfinished] status:", res.status);

        if (!res.ok) {
          throw new Error(`백엔드 응답 실패: ${res.status}`);
        }

        const data = await res.json();
        console.log("[Unfinished] raw data:", data);

        // ----------------------------
        // 3) 미완료 필터 (snake/camel 둘 다 허용)
        // ----------------------------
        const incompletes = (data || []).filter((x) => {
          const v = x.is_incomplete ?? x.isIncomplete;
          return v === true || v === 1 || v === "true";
        });

        setItems(incompletes);

        // ----------------------------
        // 4) 과목 목록 자동 생성
        // ----------------------------
        const uniqCourses = Array.from(
          new Set(incompletes.map((it) => it.course_title ?? it.courseTitle).filter(Boolean))
        );

        setCourses(["전체", ...uniqCourses]);
        setLoading(false);
        setDebug(`items loaded ✅ (${incompletes.length}개)`);

      } catch (e) {
        console.error("[Unfinished] load error:", e);
        setError(e.message);
        setLoading(false);
        setDebug("load failed ❌");
      }
    }

    load();
  }, []);

  // ----------------------------
  // 과목 선택 필터
  // ----------------------------
  const filteredItems =
    selected === "전체"
      ? items
      : items.filter((it) => (it.course_title ?? it.courseTitle) === selected);

  // ----------------------------
  // 타입별 색/라벨
  // ----------------------------
  function typeMeta(itemType = "") {
    const t = itemType.toLowerCase();
    if (t.includes("assign")) {
      return {
        label: "과제",
        bar: "bg-[#9b9b9b]",
        iconBg: "bg-[#f5f5f5]",
        iconColor: "text-[#bdbdbd]",
        chipBg: "bg-[#f5f5f5]",
        chipText: "text-[#7d7d7d]",
      };
    }
    if (t.includes("video") || t.includes("lecture")) {
      return {
        label: "강의",
        bar: "bg-[#67a6ed]",
        iconBg: "bg-[#e7f2fd]",
        iconColor: "text-[#67a6ed]",
        chipBg: "bg-[#ebf4fd]",
        chipText: "text-[#67a6ed]",
      };
    }
    if (t.includes("quiz") || t.includes("test")) {
      return {
        label: "퀴즈",
        bar: "bg-[#6fcf97]",
        iconBg: "bg-[#e9f8ef]",
        iconColor: "text-[#27ae60]",
        chipBg: "bg-[#e9f8ef]",
        chipText: "text-[#27ae60]",
      };
    }
    return {
      label: itemType || "unknown",
      bar: "bg-[#9b9b9b]",
      iconBg: "bg-[#f5f5f5]",
      iconColor: "text-[#bdbdbd]",
      chipBg: "bg-[#f5f5f5]",
      chipText: "text-[#7d7d7d]",
    };
  }

  // key helper (snake/camel 호환)
  const pick = (it, snake, camel) => it?.[snake] ?? it?.[camel];

  return (
    <div>
      {/* Appbar */}
      <div className="w-[100%] h-[8em] py-[1em] px-[3em] bg-[#fcf7fe] flex flex-col gap-5 border-b-2 border-b-gray">
        <div className="flex flex-row gap-9 items-center">
          <Link to="/">
            <FaArrowLeft />
          </Link>
          <h2 className="text-xl">미완료 과제</h2>
        </div>

        {/* 과목 필터 버튼 */}
        <div className="flex flex-row gap-6 font-medium text-sm overflow-x-auto">
          {courses.map((label) => (
            <button
              key={label}
              onClick={() => setSelected(label)}
              className={`h-[2.7rem] w-[6rem] rounded-lg flex justify-center items-center shrink-0
                ${selected === label ? "bg-[#4456ad] text-white" : "bg-[#e0e0e0]"}`}
              title={label}
            >
              <span className="truncate block w-[80%] text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col min-h-[100rem] py-[2em] px-[3em] gap-3 bg-[#fcf7fe]">

        {/* debug / error */}
        <div className="text-xs text-gray-400 mb-2">debug: {debug}</div>
        {error && (
          <div className="text-sm text-red-500 mb-3">
            에러: {error}
          </div>
        )}

        {/* 로딩 */}
        {loading && <div className="py-10 text-center">로딩중...</div>}

        {/* 빈 상태 */}
        {!loading && filteredItems.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            미완료 항목이 없습니다.
          </div>
        )}

        {/* 미완료 리스트 */}
        {!loading &&
          filteredItems.map((it) => {
            const title = pick(it, "item_title", "itemTitle") || "제목 없음";
            const course = pick(it, "course_title", "courseTitle") || "과목 없음";
            const itemType = pick(it, "item_type", "itemType") || "";
            const due = pick(it, "raw_due_text", "rawDueText");

            const meta = typeMeta(itemType);

            return (
              <div
                key={it.id}
                className="flex flex-row h-[6rem] w-[98%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]"
              >
                {/* 좌측 컬러 바 */}
                <div
                  className={`relative left-0 top-[-1rem] h-[6rem] w-2 ${meta.bar} rounded-l-lg`}
                ></div>

                {/* 아이콘 */}
                <div
                  className={`rounded-full h-[3em] w-[3em] ${meta.iconBg} flex justify-center items-center`}
                >
                  <HiOutlineClipboard
                    className={`text-3xl ${meta.iconColor}`}
                  />
                </div>

                {/* 텍스트 */}
                <div className="flex flex-col text-left gap-[0.1rem] min-w-0">
                  <p className="text-[15px] truncate">{title}</p>
                  <p className="text-sm text-[#7d7d7d] truncate">{course}</p>

                  {/* 타입 칩 */}
                  <div
                    className={`h-4 my-1 w-[4em] ${meta.chipBg} flex justify-center items-center rounded-lg`}
                  >
                    <p className={`text-xs ${meta.chipText}`}>{meta.label}</p>
                  </div>

                  {/* 마감 */}
                  {due && (
                    <p className="text-xs text-[#7d7d7d] truncate max-w-[22rem]">
                      마감: {due}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Unfinished;
