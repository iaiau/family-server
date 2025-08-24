from flask import Blueprint, render_template, send_file

# 创建蓝图对象（第一个参数是蓝图名称）
tools_bp = Blueprint('tools', __name__, url_prefix='/tools')

@tools_bp.route('/')
def index():
    return render_template('index.html',content_frame="frames/tool_frame.html")

@tools_bp.route("/alarm_clock")
def alarm_clock():
    return render_template("index.html", content_frame="frames/alarm_clock_frame.html")

@tools_bp.route("/alarm_sound/<string:sound_name>")
def alarm_sound(sound_name):
    return send_file(f"app/static/sounds/{sound_name}.mp3")

@tools_bp.route("/calculate")
def calculate():
    return render_template("index.html", content_frame="frames/calculate_frame.html")