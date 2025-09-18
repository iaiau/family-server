from datetime import datetime

from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Base(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)  # 主键
    deleted = db.Column(db.Boolean, default=False)  # 是否删除
    created_by = db.Column(db.Integer)  # 创建人
    modified_by = db.Column(db.Integer)  # 修改人
    create_time = db.Column(db.DateTime, default=datetime.utcnow())  # 创建时间
    update_time = db.Column(db.DateTime, default=datetime.utcnow())  # 修改时间


class Family(Base):
    __tablename__ = 'family'
    name = db.Column(db.String(30))
    address = db.Column(db.String(200))
    owner = db.Column(db.Integer)


class User(UserMixin, Base):
    __tablename__ = 'users'
    username = db.Column(db.String(50), unique=True)  # 用户名
    name = db.Column(db.String(30))  # 名字
    portrait = db.Column(db.String(100))
    password = db.Column(db.String(64))  # 密码
    salt = db.Column(db.String(20))
    phone_no = db.Column(db.String(20))  # 电话
    email = db.Column(db.String(100))  # email
    role = db.Column(db.String(100))
    desc = db.Column(db.String(1000))  # 简介
    age = db.Column(db.Integer)  # 年龄
    gender = db.Column(db.String(1))  # 性别
    birthday = db.Column(db.Date)
    parents = db.Column(db.String(120))  # 父母
    children = db.Column(db.String(120))  # 孩子
    spouse = db.Column(db.Integer)  # 配偶
    is_guest = db.Column(db.Boolean)  # 是否访客
    is_family = db.Column(db.Boolean, default=False)  # 是否家庭成员


class File(Base):
    __tablename__ = 'files'
    filename = db.Column(db.String(100))  # 文件名
    path = db.Column(db.String(200))  # 文件路径
    filetype = db.Column(db.String(20))  # image/video/doc
    size = db.Column(db.Integer)
    modified_times = db.Column(db.Integer, default=1)
    view_times = db.Column(db.Integer, default=1)
    download_times = db.Column(db.Integer, default=1)


class Memo(Base):
    __tablename__ = 'memos'
    title = db.Column(db.String(100))
    content = db.Column(db.String(1000))
    priority = db.Column(db.String(10))
    category = db.Column(db.String(10))


class Experience(Base):
    __tablename__ = 'experiences'
    title = db.Column(db.String(100))
    content = db.Column(db.String(10240))
    author = db.Column(db.Integer)
    read_count = db.Column(db.Integer, default=0)
    thumbs_up = db.Column(db.Integer)
    is_private = db.Column(db.Boolean, default=True)
    share_to = db.Column(db.String(2000))

class Comment(Base):
    __tablename__ = 'comments'
    exp_id = db.Column(db.Integer)
    comment = db.Column(db.String(1000))
    parent_id = db.Column(db.Integer)
    reviewer = db.Column(db.Integer)
