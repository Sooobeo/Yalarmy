# app/main.py
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.routers import yalarmy
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(yalarmy.router)
