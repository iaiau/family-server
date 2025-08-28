import os

from flask import (Blueprint, render_template, current_app, send_file, request, jsonify)
from flask_login import login_required
from werkzeug.utils import secure_filename

from app.models import File, db
from app.services import model_to_dict
from app.services.file_service import get_files
from app.utils import allow_cross_domain

# 创建蓝图对象（第一个参数是蓝图名称）
file_bp = Blueprint('files', __name__, url_prefix='/files')

# 配置文件上传
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4'}

@file_bp.route('/')
def index():
    return render_template('index.html', content_frame="frames/file_frame.html")

@file_bp.route('/list',methods=['GET'])
@login_required
def list():
    result = get_files(request.args)
    return jsonify(result)

@file_bp.route('/<int:file_id>', methods=['POST'])
@login_required
def get_file(file_id):
    file = File.query.get_or_404(file_id)
    return jsonify(model_to_dict(file))

@file_bp.route('/upload',methods=['POST'])
@allow_cross_domain
def upload():
    UPLOAD_FOLDER = current_app.root_path + '/app/static/uploads/'
    if 'files[]' not in request.files:
        return {'status': 'error', 'message': '未选择文件'}

    files = request.files.getlist('files[]')
    results = []

    for file in files:
        if file.filename == '':
            continue

        if file:  # 添加文件类型验证
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            results.append(filename)
            db.session.add(File(filename=file.filename, filetype=file.content_type,
                                path=os.path.join(UPLOAD_FOLDER, filename), modified_times=0,
                                size=file.content_length))

    return {'status': 'success', 'files': results}

@file_bp.route('/gallery')
def gallery():
    return render_template('gallery.html')

@file_bp.route('/download/<int:file_id>',methods=['POST','GET'])
def download_file(file_id):
    file = File.query.get_or_404(file_id)
    return send_file(
        file.path,
        as_attachment=True
    )