from sqlalchemy.orm import Session, contains_eager, noload, Query, joinedload
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import and_, func, CursorResult, delete
from uuid import UUID
from models import AgeGroups, Game, Role, Activity, User, FavoritesT, Snapshot
from config.logger import Logger
from typing import Optional, Any
from config.exeptions import GameDoesntExist


logger = Logger(__name__).configure()


class GameService:
    def mark_as_favorite(self, game_id: UUID, user_id: UUID, db: Session) -> bool:
        stmt = insert(FavoritesT).values(
            user_id=user_id,
            game_id=game_id
        ).on_conflict_do_nothing()
        
        result: CursorResult[Any] = db.execute(stmt)
        return result.rowcount > 0
    
    
    def remove_from_favorites(self, game_id: UUID, user_id: UUID, db: Session) -> bool:
        stmt = delete(FavoritesT).where(
            FavoritesT.c.user_id == user_id,
            FavoritesT.c.game_id == game_id
        )
        
        result: CursorResult[Any] = db.execute(stmt)
        return result.rowcount > 0
    
    
    def delete_game(self, game_id: UUID, user: User, db: Session) -> int:
        query: Query = db.query(Game).filter(Game.id == game_id)
        
        if user.role != Role.ADMIN.value:
            query = query.filter(Game.author_id == user.id)

        return query.delete()
    

    def get_game(self, game_id: UUID, user: Optional[User], db: Session) -> Optional[Game]:
        query: Query = self._build_games_query(user, db).filter(Game.id == game_id)
        game: Game = query.first()

        if not game:
            raise GameDoesntExist()
        
        return game
    

    def get_all_published_games(self, user: Optional[User], db: Session) -> list[Game]:
        query: Query = self._build_games_query(user, db)
        return query.all()
    
    
    def get_favorite_games(self, user: User, db: Session) -> list[Game]:
        query: Query = self._build_games_query(user, db)
        
        query = query.join(
            FavoritesT, Game.id == FavoritesT.c.game_id
        ).filter(
            FavoritesT.c.user_id == user.id
        )
        
        return query.all()
    

    def get_games_for(self, age_group: AgeGroups, user: Optional[User], db: Session) -> list[Game]:
        query: Query = self._build_games_query(user, db).filter(Snapshot.age_group == age_group.value)
        return query.all()
    

    def update_game_stats(self, game_id: UUID, user_id: UUID, new_score: float, db: Session) -> Activity:
        stmt = insert(Activity).values(
            user_id=user_id,
            game_id=game_id,
            last_score=new_score,
            best_score=new_score
        )
        
        stmt = stmt.on_conflict_do_update(
            index_elements=['user_id', 'game_id'],
            set_={
                'last_score': new_score,
                'best_score': func.greatest(Activity.best_score, new_score)
            }
        ).returning(Activity)
        
        activity: Activity = db.scalar(stmt)
        return activity


    def _build_games_query(self, user: Optional[User], db: Session) -> Query:
        query: Query = db.query(Game).join(
            Snapshot, Game.published_version_id == Snapshot.id
        ).options(
            contains_eager(Game.published_version),
            joinedload(Game.author)
        )
        
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