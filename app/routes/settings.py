
from flask import Blueprint, render_template
from flask_login import login_required

from app.wrappers.rolewrapper import role_required

settings_bp = Blueprint('settings', __name__, url_prefix='/settings')

@settings_bp.route("/",methods=["GET"])
@role_required("admin")
@login_required
def index():
    return render_template("index.html",content_frame="frames/settings_frame.html")