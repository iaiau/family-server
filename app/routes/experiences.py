import os

from flask import Blueprint, render_template, request, current_app
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename

from app.models import Experience, db, File

# 创建蓝图对象（第一个参数是蓝图名称）
experience_bp = Blueprint('experiences', __name__, url_prefix='/experiences')


@experience_bp.route('/')
def index():
    return render_template('index.html', expModal=True, content_frame="frames/experience_frame.html")


@experience_bp.route("/new_exp")
@login_required
def exp_editor():
    return render_template('index.html', content_frame="frames/experience_editor.html")


@experience_bp.route("/save", methods=["POST"])
@login_required
def save_exp():
    _id = request.form["id"]
    form = request.form.to_dict()
    if not _id:
        exp = Experience(title=form["title"], content=form["content"],
                         author=current_user.id)
        db.session.add(exp)
    else:
        exp = db.session.query(Experience).filter_by(id=_id).update(form)
        exp.id = _id

    db.session.flush()

    return {"status": "success","_id":exp.id}


@experience_bp.route("/exp_content/<int:_id>", methods=["GET"])
@login_required
def exp_content(_id):
    exp = Experience.query.filter(Experience.id == _id).first()
    return render_template("index.html", title=exp.title, content=exp.content,
                           content_frame="frames/experience_content.html")


@experience_bp.route('/upload',methods=['POST'])
@login_required
def upload():
    UPLOAD_FOLDER = current_app.root_path + '/app/static/uploads/exp/article'
    if 'files[]' not in request.files:
        return {'status': 'error', 'message': '未选择文件'}

    files = request.files.getlist('files[]')

    for file in files:
        if file.filename == '':
            continue

        if file:  # 添加文件类型验证
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
    return {'status': 'success','path':'/static/uploads/exp/article/' + filename}
