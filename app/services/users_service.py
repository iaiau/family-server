from sqlalchemy import select, or_

from app.models import File, db, User
from app.page_utils import get_page
from app.services import model_to_dict

def list_users(param):
    query = User.query.filter(User.deleted == False)

    if param["key"]:
        query = query.filter(or_(User.username.contains(param["key"]),
                                User.name.contains(param["key"])))

    query,page = get_page(query,param["page"],param["per_page"])

    l = query.all()
    return {"data": [model_to_dict(e) for e in l], "page":page}

def getUserByName(username):
    user = User.query.filter(User.username==username).first()
    return user