from scour.svg_regex import svg_lexer
from sqlalchemy import select, or_

from app.models import File, db, User
from app.services import model_to_dict

def list_users(param):
    query = select(User).where(User.deleted == False)

    if param["key"]:
        query = query.where(or_(User.username.contains(param["key"]),
                                User.name.contains(param["key"])))

    l = db.session.execute(query).scalars().all()
    return [model_to_dict(e) for e in l]

def getUserByName(username):
    user = User.query.filter(User.username==username).first()
    return user