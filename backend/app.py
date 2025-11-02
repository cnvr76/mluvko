from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routes.speech_route import router as speech_router
from routes.game_route import router as game_router
from routes.user_route import router as user_router


app = FastAPI(
    title="Mluvko"
)


os.makedirs("static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(speech_router, prefix="/speech", tags=["speech"])
app.include_router(game_router, prefix="/games", tags=["games"])
app.include_router(user_router, prefix="/users", tags=["users"])