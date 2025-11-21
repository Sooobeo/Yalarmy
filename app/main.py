from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import yalarmy     # ← ensure-user 라우트
from app.routers import course_items  # ← 미완료 항목 GET/POST 라우트


app = FastAPI()


# =========================================
# CORS 설정 (확장 / Flutter Web 모두 허용)
# =========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # 개발 단계에서는 전체 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================
# 라우터 등록
# =========================================
app.include_router(yalarmy.router)
app.include_router(course_items.router)


# =========================================
# 기본 루트
# =========================================
@app.get("/")
def root():
    return {"message": "Yalarmy FastAPI backend running"}
