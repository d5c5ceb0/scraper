from extensions.ext_database import db
from typing import List
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError


class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, autoincrement=True,
                   primary_key=True, nullable=False)
    group_id = db.Column(db.String(255), nullable=False, index=True)
    user_id = db.Column(db.String(255), nullable=False, index=True)
    username = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False,
                          server_default=db.text('CURRENT_TIMESTAMP(0)'))
    created_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.text('CURRENT_TIMESTAMP(0)'))
    updated_at = db.Column(db.DateTime, nullable=False,
                           server_default=db.text('CURRENT_TIMESTAMP(0)'))


def update_object_flush(obj, **kwargs):
    for field, value in kwargs.items():
        if hasattr(obj, value):
            setattr(obj, field, value)
    db.session.flush()
    return obj
