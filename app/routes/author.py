from datetime import datetime, timedelta

from flask import Blueprint, render_template, jsonify, request, session, redirect
from flask_login import login_user,login_required,logout_user,current_user

from app.services.users_service import list_users,getUserByName
from app.models import User, db
from app.wrappers.rolewrapper import *


# 创建蓝图对象（第一个参数是蓝图名称）
author_bp = Blueprint('author', __name__, url_prefix='/author')

@author_bp.route("/login")
def login():
    return render_template("login.html")


@author_bp.route("/login_action",methods=["POST"])
def login_action():
    username = request.form["username"]
    passwd = request.form["passwd"]

    user = getUserByName(username)

    if user and passwd == user.password and username == user.username:
        login_user(user)
        session["user"] = {
            'id' : user.id,
            'username' : user.username,
            'phone_no' : user.phone_no,
            'email' : user.email,
            'desc' : user.desc,
            'create_time' : user.create_time,
            "role": user.role
        }
        return jsonify({"result":"success"})

    return jsonify({"result":"error"})

@author_bp.route("/logout",methods=["GET"])
@login_required
def logout():
    logout_user()
    return redirect("/author/login")

@author_bp.route("/users", methods=["GET"])
@role_required("admin")
@login_required
def users():
    return render_template("index.html", userModal=True, content_frame="frames/user_frame.html")


@author_bp.route("/list_users", methods=["GET"])
@role_required("admin")
@login_required
def list_users_():
    return jsonify(list_users(request.args))


@author_bp.route("/add_user",methods=["POST"])
@role_required("admin")
@login_required
def add_user():
    _id = request.form["id"]
    form = request.form.to_dict()
    try:
        form["birthday"] = datetime.strptime(form["birthday"], '%Y-%m-%d').date()
    except Exception as e:
        pass
    if not _id:
        db.session.add(User(username=form["username"],name=form["name"],
                            email=form["email"],role=form["role"]))
    else:
        db.session.query(User).filter_by(id=_id).update(form)

    return {"status":"success"}


@author_bp.route("/me",methods=["GET"])
@login_required
def me():
    _id = session["user"]["id"]
    user = User.query.filter(User.id == _id).first()

    return render_template("index.html",user=user,content_frame="frames/me.html")