from sqlalchemy import inspect

def model_to_dict(model):
    mapper = inspect(model).mapper
    columns = mapper.columns._collection
    obj = {col[0]: getattr(model,col[0]) for col in columns}
    print(obj)
    return obj