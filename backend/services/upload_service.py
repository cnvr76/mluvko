import os
import uuid
from typing import Iterable

from fastapi import UploadFile

from config.exeptions import CustomException
from config.logger import Logger
from scripts.utils import hash_string


logger = Logger(__name__).configure()


# --- Konfigurácia uploadu ---
# Veľkostné limity v bajtoch.
MAX_AUDIO_BYTES: int = 5 * 1024 * 1024   # 5 MB
MAX_IMAGE_BYTES: int = 3 * 1024 * 1024   # 3 MB

# Whitelist prípon (bez bodky, lowercase). SVG zámerne nepovolené (XSS riziko).
ALLOWED_AUDIO_EXTENSIONS: tuple[str, ...] = ("mp3", "wav", "ogg", "webm", "m4a")
ALLOWED_IMAGE_EXTENSIONS: tuple[str, ...] = ("jpg", "jpeg", "png", "gif", "webp")

# Relatívne cesty (rovnaký formát ako TTS: "static/...").
AUDIO_UPLOAD_DIR: str = "static/uploads/audio"
IMAGE_UPLOAD_DIR: str = "static/uploads/images"


class FileTooLarge(CustomException):
    def __init__(self, max_bytes: int):
        super().__init__(
            f"File is too large (max {max_bytes // (1024 * 1024)} MB)",
            status_code=413,
        )


class UnsupportedFileType(CustomException):
    def __init__(self, allowed: Iterable[str]):
        super().__init__(
            f"Unsupported file type. Allowed: {', '.join(allowed)}",
            status_code=415,
        )


class UploadService:
    """
    Ukladanie a mazanie používateľsky nahraných súborov (audio + obrázky).

    Súbory sa ukladajú do `static/uploads/{audio,images}/` pod náhodným menom
    (uuid + krátky hash originálneho mena), aby kolízie boli prakticky vylúčené
    a meno súboru neobsahovalo používateľský vstup.
    """

    def __init__(self) -> None:
        os.makedirs(AUDIO_UPLOAD_DIR, exist_ok=True)
        os.makedirs(IMAGE_UPLOAD_DIR, exist_ok=True)

        # Whitelist absolútnych ciest, z ktorých povoľujeme mazanie.
        self._delete_whitelist: list[str] = [
            os.path.abspath(AUDIO_UPLOAD_DIR),
            os.path.abspath(IMAGE_UPLOAD_DIR),
        ]

    # ---------------------- public API ----------------------

    async def save_audio(self, upload: UploadFile) -> str:
        return await self._save(
            upload=upload,
            target_dir=AUDIO_UPLOAD_DIR,
            allowed_exts=ALLOWED_AUDIO_EXTENSIONS,
            max_bytes=MAX_AUDIO_BYTES,
        )

    async def save_image(self, upload: UploadFile) -> str:
        return await self._save(
            upload=upload,
            target_dir=IMAGE_UPLOAD_DIR,
            allowed_exts=ALLOWED_IMAGE_EXTENSIONS,
            max_bytes=MAX_IMAGE_BYTES,
        )

    def delete_file(self, filepath: str) -> bool:
        """Bezpečné mazanie (bez path traversal) z uploads adresárov."""
        if not filepath:
            return False

        target = os.path.abspath(filepath)
        if not any(target.startswith(allowed + os.sep) for allowed in self._delete_whitelist):
            raise ValueError("Refusing to delete a file outside the uploads directories")

        if os.path.exists(target):
            os.remove(target)
            logger.info(f"Deleted uploaded file {filepath}")
            return True

        return False

    # ---------------------- internals ----------------------

    @staticmethod
    def _extract_extension(filename: str | None) -> str:
        if not filename or "." not in filename:
            return ""
        return filename.rsplit(".", 1)[-1].lower()

    async def _save(
        self,
        upload: UploadFile,
        target_dir: str,
        allowed_exts: Iterable[str],
        max_bytes: int,
    ) -> str:
        ext = self._extract_extension(upload.filename)
        if ext not in allowed_exts:
            raise UnsupportedFileType(allowed_exts)

        # Načítame celý obsah do pamäti a hneď overíme veľkosť.
        content: bytes = await upload.read()
        if len(content) > max_bytes:
            raise FileTooLarge(max_bytes)
        if not content:
            raise UnsupportedFileType(allowed_exts)

        # Náhodné meno: uuid4 + krátky hash originálneho mena pre čitateľnosť.
        name_hint = hash_string(upload.filename or "anon")[:8]
        filename = f"{uuid.uuid4().hex}_{name_hint}.{ext}"
        filepath = os.path.join(target_dir, filename)

        with open(filepath, "wb") as buffer:
            buffer.write(content)

        logger.info(f"Saved uploaded file {filepath} ({len(content)} B)")
        # Vraciame s '/' aj na Windowse — frontend skladá URL ako `{API}/{path}`.
        return filepath.replace("\\", "/")


upload_service: UploadService = UploadService()
