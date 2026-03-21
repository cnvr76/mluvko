from fastapi import status


class CustomException(Exception):
    def __init__(self, detail: str, status_code: int):
        self.detail: str = detail
        self.status_code: int = status_code
        super().__init__(self.detail)
        
        
# -- GAMES exceptions ---
class ActivityDublicateError(CustomException):
    def __init__(self, detail: str):
        super().__init__(detail, status.HTTP_409_CONFLICT)