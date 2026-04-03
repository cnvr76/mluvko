from sqlalchemy.orm import Session, joinedload
from uuid import UUID
from models import AgeGroups, Game, VersionStatus, Snapshot, User, Role
from schemas import GameUpdate
from config.logger import Logger
from typing import Optional
from config.exeptions import VersionDoesntExist, GameDoesntExist, SnapshotEditRestriction, NotEnoughRights


logger = Logger(__name__).configure()


class SnapshotsService:
    def __get_author_snapshot(self, game_id: UUID, user_id: UUID, db: Session, required_status: Optional[VersionStatus] = None) -> Snapshot:
        query = db.query(Snapshot).join(Game, Snapshot.game_id == Game.id).filter(
            Game.id == game_id,
            Game.author_id == user_id
        )
        if required_status:
            query = query.filter(Snapshot.status == required_status.value)
            
        snapshot: Optional[Snapshot] = query.first()
        if not snapshot:
            raise VersionDoesntExist()
        
        return snapshot
    
    
    def __get_game(self, game_id: UUID, db: Session) -> Game:
        game: Optional[Game] = db.query(Game).filter(Game.id == game_id).first()
        if not game:
            raise GameDoesntExist()
        return game
    
    
    def init_draft(self, user_id: UUID, db: Session) -> dict[str, UUID]:
        game = Game(author_id=user_id)
        db.add(game)
        db.flush()
        
        draft = Snapshot(
            game_id=game.id,
            version=1,
            name="Nová hra",
            game_type="pexeso",
            age_group=AgeGroups.JUNIOR.value,
            config_data={},
            status=VersionStatus.DRAFT.value
        )
        db.add(draft)
        db.flush()
        
        return {"game_id": game.id, "snapshot_id": draft.id}
    
    
    def get_snapshot_for_testing(self, game_id: UUID, snapshot_id: UUID, user: User, db: Session) -> Snapshot:
        snapshot: Optional[Snapshot] = db.query(Snapshot).options(
            joinedload(Snapshot.game).joinedload(Game.author),
            joinedload(Snapshot.game).joinedload(Game.versions),
            joinedload(Snapshot.game).joinedload(Game.published_version)
        ).filter(
            Snapshot.id == snapshot_id,
            Snapshot.game_id == game_id
        ).first()
        
        is_admin: bool = user.role == Role.ADMIN.value
        is_author: bool = user.id == snapshot.game.author_id
        
        if not (is_admin or is_author):
            raise NotEnoughRights()
        
        return snapshot
    
    
    def get_dashboard_snapshots_for_admin(self, db: Session) -> list[Game]:
        return db.query(Game).join(
            Snapshot, Game.id == Snapshot.game_id
        ).options(
            joinedload(Game.author),
            joinedload(Game.versions),
            joinedload(Game.published_version)
        ).filter(
            Game.versions.any(Snapshot.status != VersionStatus.DRAFT.value)    
        ).distinct().all()
    
    
    def update_draft(self, game_id: UUID, user_id: UUID, config: GameUpdate, db: Session) -> None:
        draft: Optional[Snapshot] = db.query(Snapshot).join(Game, Snapshot.game_id == game_id).filter(
            Game.id == game_id,
            Game.author_id == user_id,
            Snapshot.status == VersionStatus.DRAFT.value   
        ).first()
        
        if not draft:
            latest_snapshot = db.query(Snapshot).filter(
                Snapshot.game_id == game_id
            ).order_by(Snapshot.version.desc()).first()
            
            if not latest_snapshot:
                raise GameDoesntExist()
                
            if latest_snapshot.status == VersionStatus.PENDING.value:
                raise SnapshotEditRestriction()
                
            draft = Snapshot(
                game_id=game_id,
                version=latest_snapshot.version + 1,
                status=VersionStatus.DRAFT.value,

                name=latest_snapshot.name,
                description=latest_snapshot.description,
                preview_image_url=latest_snapshot.preview_image_url,
                age_group=latest_snapshot.age_group,
                game_type=latest_snapshot.game_type,
                config_data=latest_snapshot.config_data
            )
            db.add(draft)
            db.flush()
        
        update_data = config.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if key == "age_group" and value is not None:
                setattr(draft, key, value.value)
            else:
                setattr(draft, key, value)
        
        
    def submit_for_review(self, game_id: UUID, user_id: UUID, db: Session) -> None:
        draft: Snapshot = self.__get_author_snapshot(game_id, user_id, db, VersionStatus.DRAFT)
        draft.status = VersionStatus.PENDING.value
        
        
    def get_snapshots(self, status: VersionStatus, db: Session) -> list[Snapshot]:
        snapshots: list[Snapshot] = db.query(Snapshot).options(
            joinedload(Snapshot.game).joinedload(Game.author)
        ).filter(
            Snapshot.status == status.value
        ).all()
        return snapshots
    
    
    def get_all_my_games(self, user_id: UUID, db: Session) -> list[Game]:
        return db.query(Game).options(
            joinedload(Game.versions)
        ).filter(Game.author_id == user_id).all()
        
        
    def get_my_problematic_snapshots(self, user_id: UUID, db: Session) -> list[Snapshot]:
        return db.query(Snapshot).join(Game, Snapshot.game_id == Game.id).filter(
            Game.author_id == user_id,
            Snapshot.status == VersionStatus.REJECTED.value
        ).all()
    
    
    def approve_snapshot(self, game_id: UUID, snapshot_id: UUID, db: Session) -> None:
        game: Game = self.__get_game(game_id, db)
        new_published_snapshot: Optional[Snapshot] = db.query(Snapshot).filter(Snapshot.id == snapshot_id).first()
        
        if not new_published_snapshot:
            raise VersionDoesntExist()
        
        if game.published_version_id:
            old_snapshot: Optional[Snapshot] = db.query(Snapshot).filter(Snapshot.id == game.published_version_id).first()
            if old_snapshot:
                old_snapshot.status = VersionStatus.ARCHIVED.value
            
        new_published_snapshot.status = VersionStatus.PUBLISHED.value
        game.published_version_id = new_published_snapshot.id
            
    
    def revoke_game(self, game_id: UUID, reason: str, db: Session) -> Game:
        game: Game = self.__get_game(game_id, db)
        
        if game.published_version_id:
            bad_snapshot: Optional[Snapshot] = db.query(Snapshot).filter(Snapshot.id == game.published_version_id).first()
            if bad_snapshot:
                bad_snapshot.status = VersionStatus.REJECTED.value
                bad_snapshot.admin_feedback = reason

        game.published_version_id = None
        return game
            
            
    def rollback_to_version(self, game_id: UUID, target_snapshot_id: UUID, reason: str, db: Session) -> Game:
        game: Game = self.revoke_game(game_id, reason, db)
        
        target_snapshot: Optional[Snapshot] = db.query(Snapshot).filter(Snapshot.id == target_snapshot_id).first()
        if not target_snapshot:
            raise VersionDoesntExist()
        
        target_snapshot.status = VersionStatus.PUBLISHED.value
        game.published_version_id = target_snapshot.id
        return game


snapshot_service: SnapshotsService = SnapshotsService() 