from .db_session import SqlAlchemyBase
from flask_login import UserMixin
import datetime
import sqlalchemy


class User(SqlAlchemyBase, UserMixin):
    __tablename__ = 'users'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True, unique=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    email = sqlalchemy.Column(sqlalchemy.String, index=True, unique=True, nullable=False)
    hashed_password = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    avatar = sqlalchemy.Column(sqlalchemy.BLOB, nullable=True)
    created_date = sqlalchemy.Column(sqlalchemy.Date, default=datetime.datetime.now().date())
    bonus_picked = sqlalchemy.Column(sqlalchemy.Boolean, default=False)
    last_bonus_pickup_time = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.now(), nullable=False)
    money = sqlalchemy.Column(sqlalchemy.Integer, default=3000, nullable=False)
