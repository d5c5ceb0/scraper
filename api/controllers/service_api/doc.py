# -*- coding:utf-8 -*-
from flask_restful import reqparse
from . import api
from flask_restful import Resource, marshal_with, fields, marshal
from models.block import Message, update_object_flush
import os
from extensions.ext_database import db
import logging
from sqlalchemy.exc import IntegrityError
from nostr_sdk import *
import asyncio

nostrCli = Client()

messageFields = {
    "id": fields.Integer,
    "group_id": fields.String,
    "user_id": fields.String,
    "username": fields.String,
    "message": fields.String,
    "timestamp": fields.DateTime,
    "created_at": fields.DateTime,
    "updated_at": fields.DateTime,
}

userMessagesFields = {
    "user_id": fields.String,
    "messages": fields.List(fields.Nested(messageFields)),
    "cnt": fields.Integer,
}

groupMessagesFields = {
    "user_messages": fields.List(fields.Nested(userMessagesFields)),
    "cnt": fields.Integer,
}


class AddMessage(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('group_id', type=str)
        parser.add_argument('user_id', type=str)
        parser.add_argument('username', type=str)
        parser.add_argument('message', type=str)
        args = parser.parse_args()
        message = Message(
            group_id=args['group_id'],
            user_id=args['user_id'],
            username=args['username'],
            message=args['message'],
            timestamp=db.func.now(),
        )
        try:
            db.session.add(message)
            db.session.commit()
        except IntegrityError as e:
            logging.error(e)
            db.session.rollback()
            return {'result': 'error'}, 500
        try:
            builder = EventBuilder.text_note(
                "Test from rust-nostr Python bindings!")
            asyncio.run(nostrCli.send_event(builder))
            custom_keys = Keys.generate()
            event = EventBuilder.text_note(
                "Hello from rust-nostr Python bindings!").pow(20).sign_with_keys(custom_keys)
            output = asyncio.run(nostrCli.send_event(event))
            logging.info(f"send event output: {output}")
        except Exception as e:
            logging.error(e)
        return {'result': 'ok'}, 200


class getMessageByUser(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=str)
        args = parser.parse_args()
        try:
            messages = db.session.query(Message).filter(
                Message.user_id == args['user_id']).all()
            result = {
                "user_id": args['user_id'],
                "messages": messages,
                "cnt": len(messages)
            }
        except Exception as e:
            logging.error(e)
            return {'result': 'error'}, 500
        return marshal(result, userMessagesFields)


class getMessageByGroup(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('group_id', type=str)
        args = parser.parse_args()
        try:
            messages = db.session.query(Message).filter(
                Message.group_id == args['group_id']).all()
        except Exception as e:
            logging.error(e)
            return {'result': 'error'}, 500
        user_messages = {}
        for message in messages:
            if message.user_id not in user_messages:
                user_messages[message.user_id] = {
                    'user_id': message.user_id,
                    'messages': [],
                    'cnt': 0
                }
            user_messages[message.user_id]['messages'].append(message)
            user_messages[message.user_id]['cnt'] += 1

        result = {
            'user_messages': list(user_messages.values()),
            'cnt': len(messages)
        }
        return marshal(result, groupMessagesFields)


api.add_resource(AddMessage, '/add_message')
api.add_resource(getMessageByUser, '/get_message_by_user')
api.add_resource(getMessageByGroup, '/get_message_by_group')
