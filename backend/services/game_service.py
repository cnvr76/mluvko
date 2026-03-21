from sqlalchemy.orm import Session, contains_eager, noload, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from uuid import UUID
from typing import List
from models.game_model import AgeGroups, Game
from models.activity_model import Activity
from models.user_model import User
from schemas.game_schema import GameCreate, GameBriefResponse, GameResponse
from services.user_service import user_service
from config.exeptions import ActivityDublicateError
from config.logger import Logger


logger = Logger(__name__).configure()


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
        query: Query = self._build_games_query(current_user, db).filter(Game.id == game_id)
        game: Game = query.first()
        return game

    def get_all_games(self, user_session_id: UUID, db: Session) -> List[GameBriefResponse]:
        current_user: User = user_service.get_user_by_session_id(user_session_id, db)
        query: Query = self._build_games_query(current_user, db)
        return query.all()

    def get_games_for(self, user_session_id: UUID, age_group: AgeGroups, db: Session) -> List[GameBriefResponse]:
        current_user: User = user_service.get_user_by_session_id(user_session_id, db)
        query: Query = self._build_games_query(current_user, db).filter(Game.age_group == age_group.value)
        return query.all()

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

    def _build_games_query(self, user: User, db: Session) -> Query:
        query: Query = db.query(Game)
        
        if user:
            query = query.outerjoin(
                Activity,
                and_(
                    Activity.game_id == Game.id,
                    Activity.user_id == user.id
                )
            ).options(contains_eager(Game.activities))
        else:
            query = query.options(noload(Game.activities))
            
        return query


game_service: GameService = GameService()