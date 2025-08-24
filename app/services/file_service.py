from sqlalchemy import select

from app.models import File, db
from app.services import model_to_dict


def get_files(param):
    query = select(File).where(File.deleted == False)

    if param["filename"]:
        query = query.where(File.filename.contains(param["filename"]))

    if param["filetype"]:
        query = query.where(File.filetype == param["filetype"])

    if param["start_date"]:
        query = query.where(File.create_time >= param["start_date"])

    if param["end_date"]:
        query = query.where(File.create_time <= param["end_date"])

    # return db.session.execute(query).scalars().all()
    return [model_to_dict(e) for e in db.session.execute(query).scalars().all()]