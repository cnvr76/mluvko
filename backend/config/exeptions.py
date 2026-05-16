from fastapi import status


class CustomException(Exception):
    def __init__(self, detail: str, status_code: int):
        self.detail: str = detail
        self.status_code: int = status_code
        super().__init__(self.detail)
        
        
# --- SNAPSHOTS exceptions ---
class VersionDoesntExist(CustomException):
    def __init__(self):
        self.detail: str = "Version not found or access denied"
        super().__init__(self.detail, status.HTTP_404_NOT_FOUND)
        
        
class SnapshotEditRestriction(CustomException):
    def __init__(self):
        self.detail: str = "Game is under review, you cannot edit it now & cannot send other versions"
        super().__init__(self.detail, status.HTTP_403_FORBIDDEN)
        
        
# --- GAMES exceptions ---
class GameDoesntExist(CustomException):
    def __init__(self):
        self.detail: str = "Game not found or doesn't exist"
        super().__init__(self.detail, status.HTTP_404_NOT_FOUND)
        
        
# -- USERS exceptions ---
class UserDoesntExist(CustomException):
    def __init__(self):
        self.detail: str = "User doesn't exist"
        super().__init__(self.detail, status.HTTP_404_NOT_FOUND)
        
        
# --- AUTH exceptions ---
class UserAlreadyExists(CustomException):
    def __init__(self):
        self.detail: str = "User already exists"
        super().__init__(self.detail, status.HTTP_409_CONFLICT)

class InvalidCredentials(CustomException):
    def __init__(self):
        self.detail: str = "Incorrect email or password"
        super().__init__(self.detail, status.HTTP_401_UNAUTHORIZED)
        
class RefreshTokenExpired(CustomException):
    def __init__(self):
        self.detail: str = "Refresh token expired or not found"
        super().__init__(self.detail, status.HTTP_401_UNAUTHORIZED)
        
class CredentialsValidationError(CustomException):
    def __init__(self):
        self.detail: str = "Could not validate credentials"
        super().__init__(self.detail, status.HTTP_401_UNAUTHORIZED)
        
class NotEnoughRights(CustomException):
    def __init__(self):
        self.detail: str = "You don't have enough rights to access this route"
        super().__init__(self.detail, status.HTTP_403_FORBIDDEN)
        

# --- SPEECH exceptions ---
class IncorrectAudioFormat(CustomException):
    def __init__(self):
        self.detail: str = "Only MP3s are allowed at the moment"
        super().__init__(self.detail, status.HTTP_406_NOT_ACCEPTABLE)