from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from config.exeptions import CustomException

from routes.speech_route import router as speech_router
from routes.game_route import router as game_router
from routes.user_route import router as user_router
from routes.auth_route import router as auth_router


app = FastAPI(
    title="Mluvko",
    version="1.0.2"
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


app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(speech_router, prefix="/speech", tags=["speech"])
app.include_router(game_router, prefix="/games", tags=["games"])
app.include_router(user_router, prefix="/users", tags=["users"])


@app.exception_handler(CustomException)
async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "success": False}
    )