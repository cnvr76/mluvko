from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from uuid import UUID
from typing import List, Dict, Optional
from models.game_model import AgeGroups, Game
from models.activity_model import Activity
from models.user_model import User
from schemas.game_schema import GameCreate, GameBriefResponse, GameResponse
from services.user_service import user_service


class ActivityDublicateError(Exception):
    pass


class GameService:
    def create_game(self, config: GameCreate, db: Session) -> Game:
        game = Game(**config.model_dump())
        
        db.add(game)
        db.flush()
        db.refresh(game)
        
        return game
    
    def delete_game(self, game_id: UUID, db: Session) -> int:
        return db.query(Game).filter(Game.id == game_id).delete()

    def get_game(self, game_id: UUID, user_session_id: UUID, db: Session) -> GameResponse:
        current_user: User = user_service.get_user_by_session_id(user_session_id, db)
        game: Game = db.query(Game).filter(Game.id == game_id).first()
        
        activity: List[Activity] = []
        if current_user:
            activity = db.query(Activity).filter(Activity.user_id == current_user.id,
                                                                 Activity.game_id == game_id).all()
        
        return GameResponse(
            id=game_id,
            name=game.name,
            preview_image_url=game.preview_image_url,
            activities=activity,
            description=game.description,
            age_group=game.age_group,
            game_type=game.game_type,
            config_data=game.config_data
        )

    def get_all_games(self, user_session_id: UUID, db: Session) -> List[GameBriefResponse]:
        current_user: User = user_service.get_user_by_session_id(user_session_id, db)
        games: List[Game] = db.query(Game).all()
        return self._merge_user_with_games(current_user, games, db)

    def get_games_for(self, user_session_id: UUID, age_group: AgeGroups, db: Session) -> List[GameBriefResponse]:
        current_user: User = user_service.get_user_by_session_id(user_session_id, db)
        games: List[Game] = db.query(Game).filter(Game.age_group == age_group.value).all()
        return self._merge_user_with_games(current_user, games, db)

    def update_game_stats(self, game_id: UUID, user_session_id: UUID, new_score: float, db: Session) -> Activity:
        current_user: User = user_service.get_or_create_user(user_session_id, db)
        activity: Activity = db.query(Activity).filter(Activity.user_id == current_user.id, 
                                                       Activity.game_id == game_id).first()
        if not activity:
            try:
                activity = Activity(
                    user_id=current_user.id,
                    game_id=game_id,
                    last_score=new_score,
                    best_score=new_score
                )
                db.add(activity)
                db.flush()
                db.refresh(activity)
                return activity
            except IntegrityError:
                db.rollback()
                raise ActivityDublicateError(f"Activity for {game_id=} and {current_user.id=} already exists")
        
        activity.last_score = new_score
        if activity.best_score < new_score:
            activity.best_score = new_score

        db.flush()
        db.refresh(activity)

        return activity

    def _merge_user_with_games(self, user: User, games: List[Game], db: Session) -> List[GameBriefResponse]:
        activities_map: Dict[UUID, Activity] = {}
        if user:
            activities: List[Activity] = db.query(Activity).filter(Activity.user_id == user.id).all()
            for activity in activities:
                activities_map[activity.game_id] = activity

        response: List[GameBriefResponse] = []
        for game in games:
            activity_schema_list = []
            if activity_model := activities_map.get(game.id):
                activity_schema_list.append(activity_model)

            record = GameBriefResponse(
                id=game.id,
                name=game.name,
                preview_image_url=game.preview_image_url,
                activities=activity_schema_list
            )
            response.append(record)

        return response


game_service: GameService = GameService()