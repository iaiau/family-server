from app.models import Memo
from app.page_utils import get_page
from app.services import model_to_dict
from sqlalchemy import or_

def list_by_page(args):
    query = Memo.query.filter(Memo.deleted == False)

    if args["key"]:
        query = query.filter(or_(Memo.title.contains(args["key"]), Memo.content.contains(args["key"])))

    if args["priority"] and args["priority"] != "all":
        query = query.filter(Memo.priority == args["priority"])

    if args["category"] and args["category"] != "all":
        query = query.filter(Memo.category >= args["category"])

    query, page = get_page(query, args["page"], args["per_page"])

    # return db.session.execute(query).scalars().all()
    return {"data": [model_to_dict(e) for e in query.all()], "page": page}