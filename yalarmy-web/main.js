// main.js

import { supabase } from "./supabase.js";

async function loadCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("[Yalarmy Web] courses:", data, error);
  return data;
}

async function loadCourseItems() {
  const { data, error } = await supabase
    .from("course_items")
    .select("*")
    .eq("is_incomplete", true)
    .order("has_due", { ascending: false })
    .order("created_at", { ascending: true });

  console.log("[Yalarmy Web] course_items:", data, error);
  return data;
}

window.onload = async () => {
  document.getElementById("status").innerText = "데이터 불러오는 중...";

  const courses = await loadCourses();
  const items = await loadCourseItems();

  document.getElementById("courses").innerText =
    JSON.stringify(courses, null, 2);

  document.getElementById("items").innerText =
    JSON.stringify(items, null, 2);

  document.getElementById("status").innerText = "완료!";
};
