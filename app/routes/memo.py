from flask import Blueprint, render_template, url_for, redirect, request,jsonify
from flask_login import login_required, current_user

from app.models import Memo, db
from app.services.memo_service import list_by_page

# 创建蓝图对象（第一个参数是蓝图名称）
memo_bp = Blueprint('memo', __name__, url_prefix='/memos')

@memo_bp.route('/')
@login_required
def index():
    return render_template('index.html', memoModal=True,content_frame="frames/memo_frame.html")


@memo_bp.route('/add', methods=['POST'])
@login_required
def add():
    request.form
    _id = request.form["id"]
    if not _id:
        db.session.add(Memo(title=request.form["title"], content=request.form["content"],
                            priority=request.form["priority"], category=request.form["category"]))
    else:
        Memo.query.filter(Memo.id == _id).update(request.form.to_dict())

    return jsonify({"result":"success"})

@memo_bp.route('/list', methods=['GET', 'POST'])
@login_required
def list():
    print("request.args.........................")
    print(request.args)

    res = list_by_page(request.args)

    return jsonify(res)

@memo_bp.route('/memo', methods=['GET', 'POST'])
@login_required
def memo():
    if request.method == 'POST':
        content = request.form['content']
        is_family = 'family' in request.form
        new_memo = Memo(content=content,
                        is_family=is_family,
                        author=current_user.id)
        db.session.add(new_memo)
        db.session.commit()
        return redirect(url_for('memo'))

    # 显示备忘录
    personal_memos = Memo.query.filter_by(author=current_user.id, is_family=False)
    family_memos = Memo.query.filter_by(is_family=True)
    return render_template('memo.html',
                           personal_memos=personal_memos,
                           family_memos=family_memos)

