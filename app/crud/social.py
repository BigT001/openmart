from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models.user import User
from app.models.product import Product
from sqlalchemy.exc import IntegrityError
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, ForeignKey, String

from app.db import Base
import uuid

# Association table for followers (user follows user)
class UserFollower(Base):
    __tablename__ = 'user_followers'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'))  # The user being followed
    follower_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'))  # The user who follows

# Association table for product likes
class ProductLike(Base):
    __tablename__ = 'product_likes'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'))
    product_id = Column(String(36), ForeignKey('products.id', ondelete='CASCADE'))

def follow_user(db: Session, user_id: uuid.UUID, follower_id: uuid.UUID):
    if user_id == follower_id:
        return False  # Cannot follow self
    exists = db.query(UserFollower).filter_by(user_id=user_id, follower_id=follower_id).first()
    if not exists:
        db.add(UserFollower(user_id=user_id, follower_id=follower_id))
        db.commit()
        return True
    return False

def unfollow_user(db: Session, user_id: uuid.UUID, follower_id: uuid.UUID):
    row = db.query(UserFollower).filter_by(user_id=user_id, follower_id=follower_id).first()
    if row:
        db.delete(row)
        db.commit()
        return True
    return False

def get_followers_count(db: Session, user_id: uuid.UUID):
    return db.query(func.count(UserFollower.follower_id)).filter_by(user_id=user_id).scalar()

def get_following_count(db: Session, follower_id: uuid.UUID):
    return db.query(func.count(UserFollower.user_id)).filter_by(follower_id=follower_id).scalar()

def like_product(db: Session, user_id: uuid.UUID, product_id: str):
    exists = db.query(ProductLike).filter_by(user_id=user_id, product_id=product_id).first()
    if not exists:
        db.add(ProductLike(user_id=user_id, product_id=product_id))
        db.commit()
        return True
    return False

def unlike_product(db: Session, user_id: uuid.UUID, product_id: str):
    row = db.query(ProductLike).filter_by(user_id=user_id, product_id=product_id).first()
    if row:
        db.delete(row)
        db.commit()
        return True
    return False

def get_product_likes_count(db: Session, product_id: str):
    return db.query(func.count(ProductLike.user_id)).filter_by(product_id=product_id).scalar()
