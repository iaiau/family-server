from app.models import File
from app.services import model_to_dict
from app.page_utils import get_page


def get_files(param):
    query = File.query.filter(File.deleted == False)

    if param["filename"]:
        query = query.filter(File.filename.contains(param["filename"]))

    if param["filetype"]:
        query = query.filter(File.filetype == param["filetype"])

    if param["start_date"]:
        query = query.filter(File.create_time >= param["start_date"])

    if param["end_date"]:
        query = query.filter(File.create_time <= param["end_date"])

    query,page = get_page(query, param["page"], param["per_page"])

    # return db.session.execute(query).scalars().all()
    return {"data": [model_to_dict(e) for e in query.all()], "page": page}
